"""
CodePath Python harness.

This file runs inside Pyodide (Python compiled to WebAssembly). The same file is
used in two places, so what you see in the browser is exactly what the content
checker verified:

  * in the browser, inside a Web Worker (src/runners/python/python.worker.ts)
  * in Node, by scripts/content.ts, to verify lessons and generate traces

It exposes three entry points, each taking and returning JSON text:

  _cp_run(opts)    run a program and capture its output
  _cp_check(opts)  run the exercise tests against a program
  _cp_trace(opts)  run a program step by step and record every variable change

`_cp_js` is a small JavaScript module registered by core.ts. It gives us:
  _cp_js.emit(kind, text)        stream output to the page while the code runs
  _cp_js.request_input(prompt)   ask the page for one line of input (blocking)
"""

import ast
import builtins
import io
import json
import linecache
import math
import os
import re
import sys
import traceback
import types

import _cp_js

USER_FILE = "main.py"
MAX_OUTPUT_CHARS = 200_000
MAX_TRACE_STEPS = 400
STOP_SENTINEL = "\u0000STOP"


class OutputLimitExceeded(Exception):
    """Raised when a program prints far too much (usually an endless loop)."""


# ---------------------------------------------------------------------------
# Running one program: output capture and input()
# ---------------------------------------------------------------------------

class _Session:
    """Everything that belongs to one run: the output so far and the input lines left."""

    def __init__(self, stdin_lines, interactive, stream):
        self.lines = list(stdin_lines or [])
        self.interactive = interactive
        self.stream = stream          # True: send output to the page as it happens
        self.chunks = []              # [(kind, text)] in order: "out", "err", "in"
        self.size = 0

    def write(self, kind, text):
        if not text:
            return
        self.size += len(text)
        if self.size > MAX_OUTPUT_CHARS:
            raise OutputLimitExceeded("Your program printed more than 200,000 characters.")
        self.chunks.append((kind, text))
        if self.stream:
            _cp_js.emit(kind, text)

    def transcript(self):
        """What a terminal would show: output, prompts and the typed input lines."""
        return "".join(text for kind, text in self.chunks if kind != "err")

    def stderr(self):
        return "".join(text for kind, text in self.chunks if kind == "err")


class _Stream(io.TextIOBase):
    def __init__(self, session, kind):
        self.session = session
        self.kind = kind

    def writable(self):
        return True

    def write(self, text):
        self.session.write(self.kind, str(text))
        return len(text)

    def flush(self):
        pass


def _make_input(session):
    def input(prompt=""):
        prompt = str(prompt)
        session.write("out", prompt)
        if session.lines:
            value = str(session.lines.pop(0))
        elif session.interactive:
            value = _cp_js.request_input(prompt)
            if value is None or value == STOP_SENTINEL:
                raise KeyboardInterrupt("stopped while waiting for input")
            value = str(value)
        else:
            raise EOFError(
                "input() was called, but there is no input left to read. "
                "Type your input lines in the Input box before running."
            )
        # Echo the typed value like a terminal does, so the transcript reads naturally.
        session.write("in", value + "\n")
        return value

    return input


def _write_files(files):
    """Create the lesson's sample files (e.g. bookings.csv) in the working directory."""
    for name, content in (files or {}).items():
        folder = os.path.dirname(name)
        if folder:
            os.makedirs(folder, exist_ok=True)
        with open(name, "w", encoding="utf-8") as f:
            f.write(content)


def _fresh_namespace():
    return {"__name__": "__main__", "__builtins__": builtins}


class _Capture:
    """Context manager: redirect print() and input() into a session, then restore them."""

    def __init__(self, session):
        self.session = session

    def __enter__(self):
        self.saved = (sys.stdout, sys.stderr, builtins.input)
        sys.stdout = _Stream(self.session, "out")
        sys.stderr = _Stream(self.session, "err")
        builtins.input = _make_input(self.session)
        return self

    def __exit__(self, *exc):
        sys.stdout, sys.stderr, builtins.input = self.saved
        return False


def _compile_user(code):
    # Register the source so tracebacks can show the offending line.
    linecache.cache[USER_FILE] = (len(code), None, code.splitlines(True), USER_FILE)
    return compile(code, USER_FILE, "exec")


def _error_info(exc):
    """Turn an exception into plain data: type, message, line and a traceback of the user's code only."""
    if isinstance(exc, OutputLimitExceeded):
        return {"type": "OutputLimitExceeded", "message": str(exc), "line": None, "traceback": str(exc)}

    te = traceback.TracebackException.from_exception(exc)
    te.stack = traceback.StackSummary.from_list(
        [f for f in te.stack if f.filename == USER_FILE]
    )
    formatted = "".join(te.format(chain=False))
    # The last line holds "Type: message", including hints like "Did you mean: 'print'?".
    last = "".join(te.format_exception_only()).strip().splitlines()
    head = last[-1] if last else type(exc).__name__
    message = head.split(": ", 1)[1] if ": " in head else ""

    line = None
    col = None
    if isinstance(exc, SyntaxError) and exc.filename == USER_FILE:
        line, col = exc.lineno, exc.offset
    elif te.stack:
        line = te.stack[-1].lineno

    return {
        "type": type(exc).__name__,
        "message": message,
        "line": line,
        "col": col,
        "traceback": formatted.strip(),
    }


def _execute(code, session, files, namespace=None):
    """Run the user's code. Returns (namespace, error_info or None)."""
    _write_files(files)
    ns = namespace if namespace is not None else _fresh_namespace()
    error = None
    with _Capture(session):
        try:
            exec(_compile_user(code), ns)
        except SystemExit:
            pass  # exit() / quit() just end the program
        except BaseException as exc:  # noqa: BLE001 - we report every error to the learner
            error = _error_info(exc)
    return ns, error


def _cp_run(opts_json):
    opts = json.loads(opts_json)
    session = _Session(opts.get("stdin"), opts.get("interactive", False), stream=True)
    _, error = _execute(opts["code"], session, opts.get("files"))
    return json.dumps({
        "ok": error is None,
        "stdout": session.transcript(),
        "stderr": session.stderr(),
        "error": error,
    })


# ---------------------------------------------------------------------------
# Exercise tests
# ---------------------------------------------------------------------------

def _is_number(v):
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def _same(expected, actual):
    """Compare a JSON expected value with a Python value. Floats get a tiny tolerance."""
    if isinstance(expected, bool) or isinstance(actual, bool):
        return type(expected) is type(actual) and expected == actual
    if _is_number(expected) and _is_number(actual):
        return math.isclose(actual, expected, rel_tol=1e-9, abs_tol=1e-9)
    if isinstance(expected, list):
        return (isinstance(actual, (list, tuple)) and len(actual) == len(expected)
                and all(_same(e, a) for e, a in zip(expected, actual)))
    if isinstance(expected, dict):
        return (isinstance(actual, dict) and set(map(str, actual)) == set(expected)
                and all(_same(expected[k], actual.get(k, actual.get(_maybe_int(k)))) for k in expected))
    return expected == actual


def _maybe_int(key):
    try:
        return int(key)
    except ValueError:
        return key


def _show(value):
    """repr() of a value, shortened so feedback stays readable."""
    text = repr(value)
    return text if len(text) <= 120 else text[:117] + "..."


def _type_hint(expected, actual):
    """Extra explanation for the most common beginner mix-ups."""
    if actual is None and expected is not None:
        return "None usually means a function has no `return` (or it only prints)."
    if _is_number(expected) and isinstance(actual, str):
        return f"That's the text {actual!r} (a str), not a number."
    if isinstance(expected, str) and _is_number(actual):
        return f"That's the number {actual!r}, but text (a str) was expected."
    return ""


def _show_expected(expected, actual):
    """JSON has no float/int distinction (1395.0 arrives as 1395): match the learner's type for display."""
    if isinstance(expected, int) and not isinstance(expected, bool) and isinstance(actual, float):
        return _show(float(expected))
    return _show(expected)


def _join(*parts):
    return " ".join(p for p in parts if p)


def _normalize_output(text):
    lines = [line.rstrip() for line in text.replace("\r\n", "\n").split("\n")]
    while lines and lines[-1] == "":
        lines.pop()
    return lines


def _clip(text, limit=90):
    return text if len(text) <= limit else text[: limit - 1] + "…"


def _compare_output(expected, actual):
    exp, act = _normalize_output(expected), _normalize_output(actual)
    for i, (e, a) in enumerate(zip(exp, act), start=1):
        if e != a:
            return f"Line {i} should be `{e}` but your program printed `{_clip(a)}`."
    if len(act) < len(exp):
        missing = exp[len(act)]
        return (f"Your program printed {len(act)} line(s) but {len(exp)} were expected. "
                f"The first missing line is `{missing}`.")
    if len(act) > len(exp):
        return (f"Your program printed {len(act)} lines but only {len(exp)} were expected. "
                f"Extra line: `{_clip(act[len(exp)])}`.")
    return ""


def _default_label(test):
    kind = test["kind"]
    stdin = test.get("stdin")
    with_input = f" (input: {', '.join(stdin)})" if stdin else ""
    if kind == "output":
        return "Prints the expected output" + with_input
    if kind == "contains":
        return "Output mentions the expected values" + with_input
    if kind == "call":
        return f"{test['call']} returns the right value"
    if kind == "var":
        return f"Variable `{test['variable']}` has the right value"
    if kind == "raises":
        target = test.get("call") or "your program"
        return f"{target} raises {test['expect']}"
    return "Custom check"


class _Fail(Exception):
    pass


def _run_one_test(test, code, default_stdin, files):
    stdin = test.get("stdin", default_stdin)
    session = _Session(stdin, interactive=False, stream=False)
    ns, error = _execute(code, session, files)
    output = session.transcript()
    kind = test["kind"]
    hint = test.get("hint", "")

    if kind == "raises" and not test.get("call"):
        if error and error["type"] == test["expect"]:
            return True, "", None
        if error:
            return False, f"Expected a {test['expect']}, but got {error['type']}: {error['message']}", error
        return False, _join(f"Expected your program to raise {test['expect']}, but it finished without an error.", hint), None

    if error:
        where = f" on line {error['line']}" if error.get("line") else ""
        return False, f"Your code stopped with {error['type']}{where}: {error['message']}", error

    if kind == "output":
        diff = _compare_output(test["expect"], output)
        return (not diff), _join(diff, hint), None

    if kind == "contains":
        wanted = test["expect"] if isinstance(test["expect"], list) else [test["expect"]]
        missing = [w for w in wanted if w not in output]
        if missing:
            shown = ", ".join(f"`{m}`" for m in missing)
            return False, _join(f"Your output doesn't contain {shown}.", hint), None
        return True, "", None

    if kind == "var":
        name = test["variable"]
        if name not in ns:
            return False, f"There is no variable called `{name}`. Check the spelling (capitals count).", None
        actual = ns[name]
        if _same(test["expect"], actual):
            return True, "", None
        return False, _join(f"`{name}` should be {_show_expected(test['expect'], actual)}, but it is {_show(actual)}.",
                            _type_hint(test["expect"], actual), hint), None

    if kind in ("call", "raises"):
        call = test["call"]
        call_session = _Session([], interactive=False, stream=False)
        with _Capture(call_session):
            try:
                actual = eval(compile(call, "<test>", "eval"), ns)
                raised = None
            except BaseException as exc:  # noqa: BLE001
                raised = exc
        if kind == "raises":
            if raised is not None and type(raised).__name__ == test["expect"]:
                return True, "", None
            if raised is not None:
                return False, _join(f"`{call}` raised {type(raised).__name__} instead of {test['expect']}.", hint), None
            return False, _join(f"`{call}` should raise {test['expect']}, but it returned {_show(actual)}.", hint), None
        if raised is not None:
            info = _error_info(raised)
            if isinstance(raised, NameError) and call.split("(")[0] in str(raised):
                return False, f"`{call.split('(')[0]}` doesn't exist. Did you define the function with exactly this name?", info
            where = f" (line {info['line']})" if info.get("line") else ""
            return False, f"Calling `{call}` crashed with {info['type']}{where}: {info['message']}", info
        if _same(test["expect"], actual):
            return True, "", None
        return False, _join(f"`{call}` should return {_show_expected(test['expect'], actual)}, but it returned {_show(actual)}.",
                            _type_hint(test["expect"], actual), hint), None

    if kind == "py":
        def fail(message):
            raise _Fail(message)

        check_ns = {"ns": ns, "output": output, "lines": _normalize_output(output), "fail": fail}
        try:
            exec(compile(test["check"], "<check>", "exec"), check_ns)
        except _Fail as f:
            return False, _join(str(f), hint), None
        except AssertionError as a:
            return False, _join(str(a) or "A check failed.", hint), None
        return True, "", None

    return False, f"Unknown test kind {kind!r}", None


def _cp_check(opts_json):
    opts = json.loads(opts_json)
    results = []
    for test in opts["tests"]:
        if test["kind"] == "source":
            continue  # source-code pattern tests are checked in TypeScript
        passed, message, error = _run_one_test(test, opts["code"], opts.get("stdin"), opts.get("files"))
        results.append({
            "label": test.get("label") or _default_label(test),
            "passed": passed,
            "message": message,
            "error": error,
        })
    return json.dumps(results)


# ---------------------------------------------------------------------------
# Step-by-step tracer
# ---------------------------------------------------------------------------
# For every line that runs we record: the line, which variables changed, what
# was printed, and a "how" explanation such as
#     total = total + price  →  0 + 450  →  450
# The explanation is produced by substituting the current variable values into
# the expression *before* the line runs, then reading the real result after it.

_HIDDEN_TYPES = (types.FunctionType, types.BuiltinFunctionType, types.ModuleType, type, types.MethodType)
_DATA_TYPES = (int, float, str, bool, type(None), list, tuple, dict, set)
_ADDRESS = re.compile(r" at 0x[0-9a-fA-F]+")


def _short_repr(value, limit=70):
    text = _ADDRESS.sub("", repr(value))
    return text if len(text) <= limit else text[: limit - 3] + "..."


def _visible_vars(frame):
    source = frame.f_globals if frame.f_code.co_name == "<module>" else frame.f_locals
    result = {}
    for name, value in dict(source).items():
        if name.startswith("__") or isinstance(value, _HIDDEN_TYPES):
            continue
        result[name] = _short_repr(value)
    return result


def _is_literal(node):
    """True for plain values written out: 3, -2.5, 'text', True, None, [1, 2], {'a': 1}."""
    if isinstance(node, ast.Constant):
        return True
    if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.USub, ast.UAdd)) and isinstance(node.operand, ast.Constant):
        return True
    if isinstance(node, (ast.List, ast.Tuple, ast.Set)):
        return all(_is_literal(e) for e in node.elts)
    if isinstance(node, ast.Dict):
        return all(k is not None and _is_literal(k) for k in node.keys) and all(_is_literal(v) for v in node.values)
    return False


def _literal_node(value):
    """An AST node that spells out `value` (e.g. 450, 'Ana', [1, 2]), or None if it can't be shown."""
    if not isinstance(value, _DATA_TYPES):
        return None
    text = _short_repr(value, limit=40)
    if text.endswith("..."):
        return None
    try:
        node = ast.parse(text, mode="eval").body
    except SyntaxError:
        return None
    return node if _is_literal(node) else None


class _Substituter(ast.NodeTransformer):
    """Replace variable names in an expression with their current values."""

    def __init__(self, frame):
        self.frame = frame

    def _value_of(self, node):
        code = compile(ast.Expression(node), "<sub>", "eval")
        return eval(code, self.frame.f_globals, dict(self.frame.f_locals))

    def visit_Name(self, node):
        if not isinstance(node.ctx, ast.Load):
            return node
        for scope in (self.frame.f_locals, self.frame.f_globals):
            if node.id in scope:
                return _literal_node(scope[node.id]) or node
        return node

    def _simple_lookup(self, node):
        """`booking["nights"]` or `self.rate`: show the value, keep complex things as written."""
        if isinstance(node.value, (ast.Name, ast.Attribute, ast.Subscript)):
            try:
                return _literal_node(self._value_of(node))
            except Exception:  # noqa: BLE001 - lookups that fail just stay as written
                return None
        return None

    def visit_Attribute(self, node):
        return self._simple_lookup(node) or node

    def visit_Subscript(self, node):
        found = self._simple_lookup(node)
        if found:
            return found
        node.slice = self.visit(node.slice)
        return node

    def visit_Call(self, node):
        # Keep the function name as written; substitute only the arguments.
        node.args = [self.visit(a) for a in node.args]
        for kw in node.keywords:
            kw.value = self.visit(kw.value)
        return node

    # Inside comprehensions and lambdas the names mean something else: leave them alone.
    def visit_ListComp(self, node):
        return node

    visit_SetComp = visit_DictComp = visit_GeneratorExp = visit_Lambda = visit_ListComp


# Built-in functions that are safe to evaluate while explaining a line.
_PURE_FUNCS = {"round", "int", "float", "str", "len", "abs", "min", "max", "sum", "bool"}


def _eval_literal(node):
    return eval(compile(ast.Expression(node), "<reduce>", "eval"), {"__builtins__": builtins}, {})


def _reduce_children(node, children, setter):
    """Reduce the first child that can still be simplified. Returns True if one changed."""
    for i, child in enumerate(children):
        step = _reduce_once(child)
        if step is not None:
            setter(i, step)
            return True
        if not _is_literal(child):
            return None  # stuck on something we can't evaluate (e.g. a function call)
    return False


def _reduce_once(node):
    """
    Do ONE evaluation step, in the order Python itself uses (innermost first,
    left to right, respecting operator precedence). Returns the new node, or
    None when nothing more can be simplified.
    """
    if _is_literal(node):
        return None

    if isinstance(node, ast.BoolOp):  # and / or stop early, just like Python does
        first = node.values[0]
        step = _reduce_once(first)
        if step is not None:
            node.values[0] = step
            return node
        if not _is_literal(first):
            return None
        value = _eval_literal(first)
        decided = (not value) if isinstance(node.op, ast.And) else bool(value)
        if decided or len(node.values) == 1:
            return first
        rest = node.values[1:]
        return rest[0] if len(rest) == 1 else ast.BoolOp(op=node.op, values=rest)

    if isinstance(node, ast.IfExp):  # a if condition else b
        step = _reduce_once(node.test)
        if step is not None:
            node.test = step
            return node
        if not _is_literal(node.test):
            return None
        return node.body if _eval_literal(node.test) else node.orelse

    if isinstance(node, ast.JoinedStr):  # f-strings: fill in each {…}, then build the text
        parts = [p for p in node.values if isinstance(p, ast.FormattedValue)]
        changed = _reduce_children(node, [p.value for p in parts], lambda i, new: setattr(parts[i], "value", new))
        if changed:
            return node
        return _literal_node(_eval_literal(node)) if changed is False else None

    if isinstance(node, ast.Call):
        values = list(node.args) + [k.value for k in node.keywords]

        def set_arg(i, new):
            if i < len(node.args):
                node.args[i] = new
            else:
                node.keywords[i - len(node.args)].value = new

        changed = _reduce_children(node, values, set_arg)
        if changed:
            return node
        pure = isinstance(node.func, ast.Name) and node.func.id in _PURE_FUNCS
        if changed is False and pure:
            return _literal_node(_eval_literal(node))
        return None

    if isinstance(node, ast.BinOp):
        def set_bin(i, new):
            if i == 0:
                node.left = new
            else:
                node.right = new

        changed = _reduce_children(node, [node.left, node.right], set_bin)
    elif isinstance(node, ast.UnaryOp):
        changed = _reduce_children(node, [node.operand], lambda i, new: setattr(node, "operand", new))
    elif isinstance(node, ast.Compare):
        def set_cmp(i, new):
            if i == 0:
                node.left = new
            else:
                node.comparators[i - 1] = new

        changed = _reduce_children(node, [node.left, *node.comparators], set_cmp)
    else:
        return None

    if changed:
        return node
    if changed is False:
        return _literal_node(_eval_literal(node))
    return None


def _explain_expr(expr, frame):
    """
    ['nights * rate', '3 * 450', '1350']: the expression as written, with the
    current values filled in, then one entry per evaluation step.
    """
    source = ast.unparse(expr)
    steps = [source]
    try:
        tree = _Substituter(frame).visit(ast.parse(source, mode="eval").body)
        text = ast.unparse(tree)
        if len(text) <= 140:
            steps.append(text)
            for _ in range(8):
                nxt = _reduce_once(tree)
                if nxt is None:
                    break
                tree = nxt
                text = ast.unparse(tree)
                if len(text) > 140:
                    break
                steps.append(text)
    except Exception:  # noqa: BLE001 - an explanation is optional; the real run decides
        pass
    out = []
    for step in steps:
        if not out or out[-1] != step:
            out.append(step)
    return out


def _chain(*parts):
    """Join 'a → b → c', dropping steps that repeat the previous one."""
    out = []
    for p in parts:
        if p is not None and (not out or out[-1] != p):
            out.append(p)
    return " → ".join(out)


def _body_range(stmts):
    return stmts[0].lineno, max(getattr(s, "end_lineno", s.lineno) for s in stmts)


class _Tracer:
    def __init__(self, code, session):
        self.lines = code.splitlines()
        self.session = session
        self.steps = []
        self.pending = {}       # id(frame) -> step being recorded
        self.prev_vars = {}     # id(frame) -> vars after the last finished step
        self.loop_rounds = {}   # (id(frame), line) -> round counter
        self.consumed = 0       # how much of the output has been assigned to steps
        self.truncated = False
        self.stmt_at = {}
        for node in ast.walk(ast.parse(code)):
            if isinstance(node, ast.stmt):
                self.stmt_at.setdefault(node.lineno, node)

    # -- helpers -------------------------------------------------------------
    def _scope(self, frame):
        name = frame.f_code.co_name
        return "main" if name == "<module>" else name

    def _output_since_last(self):
        text = self.session.transcript()
        new = text[self.consumed:]
        self.consumed = len(text)
        return new

    def _is_user_frame(self, frame):
        name = frame.f_code.co_name
        return frame.f_code.co_filename == USER_FILE and (name == "<module>" or not name.startswith("<"))

    # -- recording -----------------------------------------------------------
    def _start(self, frame, lineno):
        if len(self.steps) >= MAX_TRACE_STEPS:
            self.truncated = True
            sys.settrace(None)
            frame.f_trace = None
            return
        node = self.stmt_at.get(lineno)
        step = {
            "line": lineno,
            "code": self.lines[lineno - 1].strip() if 0 < lineno <= len(self.lines) else "",
            "scope": self._scope(frame),
            "kind": "line",
            "how": None,
        }
        # Work out the explanation of the expression *before* the line runs,
        # while the variables still hold their old values.
        expr = None
        if isinstance(node, (ast.Assign, ast.AnnAssign)) and node.value is not None:
            expr = node.value
        elif isinstance(node, ast.AugAssign):
            expr = ast.BinOp(left=_as_load(node.target), op=node.op, right=node.value)
        elif isinstance(node, (ast.If, ast.While)):
            expr = node.test
        elif isinstance(node, ast.Return) and node.value is not None:
            expr = node.value
        elif isinstance(node, ast.Expr) and isinstance(node.value, ast.Call):
            expr = node.value  # e.g. print(3 * 450): show 3 * 450 → 1350
        step["_node"] = node
        step["_expr"] = _explain_expr(expr, frame) if expr is not None else None
        self.steps.append(step)
        self.pending[id(frame)] = step

    def _finish(self, frame, next_line=None, retval=None, returning=False):
        step = self.pending.pop(id(frame), None)
        if step is None:
            return
        now = _visible_vars(frame)
        before = self.prev_vars.get(id(frame), {})
        step["vars"] = now
        step["changed"] = [k for k in now if before.get(k) != now[k]]
        self.prev_vars[id(frame)] = now
        step["output"] = self._output_since_last()
        step["how"] = self._describe(step, frame, next_line, retval, returning)

    def _describe(self, step, frame, next_line, retval, returning):
        node, expr = step.pop("_node"), step.pop("_expr")
        if isinstance(node, ast.Return) and returning:
            if expr is None:
                return "return None (the function ends)"
            result = _short_repr(retval)
            return _chain(f"return {expr[0]}", *expr[1:], None if result == expr[-1] else result)

        if isinstance(node, (ast.Assign, ast.AnnAssign, ast.AugAssign)) and expr:
            targets = node.targets if isinstance(node, ast.Assign) else [node.target]
            target_text = " = ".join(ast.unparse(t) for t in targets)
            result = self._target_value(targets[-1], frame)
            return _chain(f"{target_text} = {expr[0]}", *expr[1:], None if result == expr[-1] else result)

        if isinstance(node, (ast.If, ast.While)) and expr:
            start, end = _body_range(node.body)
            went_in = next_line is not None and start <= next_line <= end
            steps = [s for s in expr if s not in ("True", "False")]
            verdict = "True" if went_in else "False"
            if isinstance(node, ast.While):
                outcome = "run the loop body" if went_in else "the loop ends"
            else:
                outcome = "run the indented block" if went_in else "skip the block"
            return _chain(*steps, verdict, outcome)

        if isinstance(node, ast.Expr) and expr and len(expr) > 1:
            return _chain(*expr)

        if isinstance(node, ast.For):
            start, end = _body_range(node.body)
            key = (id(frame), node.lineno)
            if next_line is not None and start <= next_line <= end:
                self.loop_rounds[key] = self.loop_rounds.get(key, 0) + 1
                target = ast.unparse(node.target)
                value = self._target_value(node.target, frame)
                return f"round {self.loop_rounds[key]}: {target} = {value}"
            rounds = self.loop_rounds.pop(key, 0)
            return f"no items left after {rounds} round(s) → the loop ends"
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            return f"defines the function {node.name}() (its body runs only when it is called)"
        if isinstance(node, ast.ClassDef):
            return f"defines the class {node.name}"
        if isinstance(node, (ast.Import, ast.ImportFrom)):
            return "loads a module so its tools can be used"
        return None

    def _target_value(self, target, frame):
        try:
            if isinstance(target, ast.Tuple):
                return ", ".join(self._target_value(t, frame) for t in target.elts)
            value = eval(compile(ast.Expression(_as_load(target)), "<t>", "eval"),
                         frame.f_globals, dict(frame.f_locals))
            return _short_repr(value)
        except Exception:  # noqa: BLE001
            return None

    # -- the sys.settrace callback ------------------------------------------
    def __call__(self, frame, event, arg):
        if not self._is_user_frame(frame):
            return None
        if event == "call":
            if frame.f_code.co_name != "<module>":
                args = _visible_vars(frame)
                self.steps.append({
                    "line": frame.f_lineno,
                    "code": f"call {frame.f_code.co_name}(" + ", ".join(f"{k}={v}" for k, v in args.items()) + ")",
                    "scope": self._scope(frame),
                    "kind": "call",
                    "how": "a new, separate set of variables is created for this call",
                    "vars": args,
                    "changed": list(args),
                    "output": self._output_since_last(),
                })
                self.prev_vars[id(frame)] = args
            return self
        if event == "line":
            self._finish(frame, next_line=frame.f_lineno)
            self._start(frame, frame.f_lineno)
        elif event == "return":
            self._finish(frame, retval=arg, returning=True)
            self.prev_vars.pop(id(frame), None)
        return self


def _as_load(node):
    """Copy an assignment target so it can be read back as an expression."""
    copy = ast.parse(ast.unparse(node), mode="eval").body
    return copy


def _cp_trace(opts_json):
    opts = json.loads(opts_json)
    code = opts["code"]
    session = _Session(opts.get("stdin"), interactive=False, stream=False)
    try:
        tracer = _Tracer(code, session)
    except SyntaxError as exc:
        return json.dumps({"steps": [], "output": "", "error": _error_info(exc), "truncated": False})

    _write_files(opts.get("files"))
    ns = _fresh_namespace()
    error = None
    compiled = _compile_user(code)
    with _Capture(session):
        sys.settrace(tracer)
        try:
            exec(compiled, ns)
        except SystemExit:
            pass
        except BaseException as exc:  # noqa: BLE001
            error = _error_info(exc)
        finally:
            sys.settrace(None)
    # A step that crashed never got "finished": close it so the table stays complete.
    for step in tracer.steps:
        if "vars" not in step:
            step.pop("_node", None)
            step.pop("_expr", None)
            step.update({"vars": {}, "changed": [], "output": "", "how": None})
    # Mark the step where the program crashed.
    if error and error.get("line"):
        for step in reversed(tracer.steps):
            if step["line"] == error["line"]:
                step["how"] = _chain(step.get("how"), f"💥 {error['type']}: the program stops here")
                break
    leftover = session.transcript()[tracer.consumed:]
    if leftover and tracer.steps:
        tracer.steps[-1]["output"] += leftover
    return json.dumps({
        "steps": tracer.steps,
        "output": session.transcript(),
        "error": error,
        "truncated": tracer.truncated,
    })
