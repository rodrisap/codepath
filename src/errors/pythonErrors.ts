/**
 * The error translator for Python: turns an error type + message into a short,
 * plain-English explanation and a hint about where to look.
 *
 * Each rule has a `match` (error type, optional message pattern) and an
 * `explain` function that can use the pieces captured by the pattern.
 * The first rule that matches wins, so specific rules come before general ones.
 */
import type { RunError } from "../runners/types";

export interface Translation {
  title: string;
  explanation: string;
  lookAt: string;
}

interface Rule {
  type: string | RegExp;
  message?: RegExp;
  explain: (m: RegExpMatchArray, err: RunError) => Translation;
}

const lineRef = (err: RunError) => (err.line ? `line ${err.line}` : "the highlighted line");

const rules: Rule[] = [
  // ---- Mistakes Python spots before running anything --------------------
  {
    type: "SyntaxError",
    message: /expected ':'/,
    explain: (_, e) => ({
      title: "Missing colon",
      explanation: "Lines that start a block (`if`, `elif`, `else`, `for`, `while`, `def`, `class`) must end with a colon `:`.",
      lookAt: `The end of ${lineRef(e)}.`,
    }),
  },
  {
    type: "SyntaxError",
    message: /unterminated string literal|unterminated triple-quoted|EOL while scanning/,
    explain: (_, e) => ({
      title: "A text value isn't closed",
      explanation: "A string started with a quote but never got its closing quote. Every `\"` or `'` needs a partner of the same kind.",
      lookAt: `Count the quotes on ${lineRef(e)}.`,
    }),
  },
  {
    type: "SyntaxError",
    message: /'\(' was never closed|'\[' was never closed|'\{' was never closed|unexpected EOF/,
    explain: (_, e) => ({
      title: "A bracket is never closed",
      explanation: "Every `(`, `[` or `{` needs its matching `)`, `]` or `}`. Python reached the end without finding it.",
      lookAt: `${lineRef(e)}. The missing bracket is often at the end of that line.`,
    }),
  },
  {
    type: "SyntaxError",
    message: /unmatched '(.)'|closing parenthesis/,
    explain: (m, e) => ({
      title: "An extra closing bracket",
      explanation: `There is a \`${m[1] ?? ")"}\` without a matching opening bracket.`,
      lookAt: `Count the brackets on ${lineRef(e)}.`,
    }),
  },
  {
    type: "SyntaxError",
    message: /invalid syntax\. Maybe you meant '==' or ':=' instead of '='|cannot assign to/,
    explain: (_, e) => ({
      title: "`=` used where a comparison was meant",
      explanation: "A single `=` stores a value in a variable. To compare two values use `==`.",
      lookAt: `The condition on ${lineRef(e)}.`,
    }),
  },
  {
    type: "SyntaxError",
    message: /Perhaps you forgot a comma/,
    explain: (_, e) => ({
      title: "Missing comma",
      explanation: "Two values are next to each other without a comma between them, e.g. inside `print(...)` or a list.",
      lookAt: `${lineRef(e)}, where the ^ marks point.`,
    }),
  },
  {
    type: "SyntaxError",
    message: /Missing parentheses in call to 'print'/,
    explain: (_, e) => ({
      title: "print needs brackets",
      explanation: "In Python 3, `print` is a function: write `print(\"hello\")`, not `print \"hello\"`.",
      lookAt: lineRef(e),
    }),
  },
  {
    type: "SyntaxError",
    explain: (_, e) => ({
      title: "Python can't read this line",
      explanation: "The code breaks Python's grammar rules, so nothing ran. Look for a missing `:`, quote, bracket or comma, or a typo in a keyword.",
      lookAt: `${lineRef(e)}. Sometimes the real mistake is at the end of the line *above* it.`,
    }),
  },
  {
    type: "IndentationError",
    message: /expected an indented block/,
    explain: (_, e) => ({
      title: "Empty block",
      explanation: "After a line ending in `:` Python expects at least one indented line (4 spaces) belonging to it.",
      lookAt: `The line after the \`:\`, near ${lineRef(e)}.`,
    }),
  },
  {
    type: /IndentationError|TabError/,
    explain: (_, e) => ({
      title: "Indentation is off",
      explanation: "Python uses the spaces at the start of a line to know which lines belong together. Lines in the same block must line up exactly (use 4 spaces).",
      lookAt: `The start of ${lineRef(e)} and the lines around it.`,
    }),
  },

  // ---- Mistakes that happen while running ------------------------------
  {
    type: "NameError",
    message: /name '(\w+)' is not defined(?:\. Did you mean: '(\w+)'\?)?/,
    explain: (m, e) => ({
      title: `Python doesn't know \`${m[1]}\``,
      explanation: m[2]
        ? `There is no variable or function called \`${m[1]}\`. Did you mean \`${m[2]}\`? It's probably a typo.`
        : `There is no variable or function called \`${m[1]}\` at this point. Either it's a typo, it's used *before* it gets a value, or text is missing its quotes ("${m[1]}").`,
      lookAt: `${lineRef(e)}, and where \`${m[1]}\` is supposed to be created.`,
    }),
  },
  {
    type: "UnboundLocalError",
    message: /local variable '(\w+)'/,
    explain: (m, e) => ({
      title: `\`${m[1]}\` is used inside the function before it gets a value there`,
      explanation: `Because the function *assigns* to \`${m[1]}\` somewhere, Python treats it as a new local variable for the whole function, separate from the one outside. Pass the value in as a parameter and \`return\` the new value instead.`,
      lookAt: lineRef(e),
    }),
  },
  {
    type: "TypeError",
    message: /can only concatenate str \(not "(\w+)"\) to str/,
    explain: (m, e) => ({
      title: "Mixing text and numbers with +",
      explanation: `\`+\` can join two strings, but here one side is a ${m[1]}. Convert it with \`str(...)\`, or better, use an f-string: \`f"Total: {total}"\`.`,
      lookAt: lineRef(e),
    }),
  },
  {
    type: "TypeError",
    message: /unsupported operand type\(s\) for (.+): '(\w+)' and '(\w+)'/,
    explain: (m, e) => ({
      title: `Can't use ${m[1]} on a ${m[2]} and a ${m[3]}`,
      explanation:
        m[2] === "str" || m[3] === "str"
          ? "One of the values is text (str). Text that looks like a number, such as \"450\", is still text. Convert it first with `int(...)` or `float(...)`."
          : `The operator ${m[1]} doesn't work between these two types. Check what each variable holds with print(type(x)).`,
      lookAt: lineRef(e),
    }),
  },
  {
    type: "TypeError",
    message: /'(\w+)' object is not callable/,
    explain: (m, e) => ({
      title: `A ${m[1]} is being used like a function`,
      explanation: `Something followed by brackets \`(...)\` is being called, but it's a ${m[1]}, not a function. Maybe a variable has the same name as a function (e.g. you named a variable \`sum\` or \`print\`), or a \`*\` is missing: \`2(3)\` vs \`2 * 3\`.`,
      lookAt: lineRef(e),
    }),
  },
  {
    type: "TypeError",
    message: /missing (\d+) required positional argument/,
    explain: (_, e) => ({
      title: "Not enough values passed to a function",
      explanation: "The function was called with fewer arguments than it has parameters. Compare the call with the `def` line.",
      lookAt: lineRef(e),
    }),
  },
  {
    type: "TypeError",
    message: /takes (\d+) positional arguments? but (\d+) (?:were|was) given/,
    explain: (m, e) => ({
      title: "Too many values passed to a function",
      explanation: `The function expects ${m[1]} argument(s) but received ${m[2]}. (In a class method, \`self\` counts as one.)`,
      lookAt: lineRef(e),
    }),
  },
  {
    type: "TypeError",
    message: /'(\w+)' object is not subscriptable/,
    explain: (m, e) => ({
      title: `Can't use [ ] on a ${m[1]}`,
      explanation: `Square brackets pick items out of lists, strings and dicts, but this value is a ${m[1]}.`,
      lookAt: lineRef(e),
    }),
  },
  {
    type: "TypeError",
    explain: (_, e) => ({
      title: "Wrong type of value",
      explanation: "An operation received a value of the wrong type (for example text where a number was needed). Print the values involved, together with `type(...)`, to see what they really are.",
      lookAt: lineRef(e),
    }),
  },
  {
    type: "ValueError",
    message: /invalid literal for int\(\) with base 10: '(.*)'/,
    explain: (m, e) => ({
      title: `"${m[1]}" isn't a whole number`,
      explanation: `\`int()\` can only convert text that looks like a whole number, such as "450". "${m[1]}" isn't one (decimal points, spaces and letters all count).`,
      lookAt: `${lineRef(e)}, and the input that was typed.`,
    }),
  },
  {
    type: "ValueError",
    message: /could not convert string to float: '(.*)'/,
    explain: (m, e) => ({
      title: `"${m[1]}" isn't a number`,
      explanation: "`float()` can only convert text that looks like a number, like \"12.50\". Commas as decimal separators (\"12,50\") also fail.",
      lookAt: lineRef(e),
    }),
  },
  {
    type: "ValueError",
    explain: (_, e) => ({
      title: "Right type, wrong value",
      explanation: "The value has the right type but a value that doesn't make sense for this operation.",
      lookAt: lineRef(e),
    }),
  },
  {
    type: "ZeroDivisionError",
    explain: (_, e) => ({
      title: "Division by zero",
      explanation: "Something was divided by 0, which has no answer. Check the divisor. In business code this often means \"no bookings\" or \"no nights\", so handle that case with an `if` first.",
      lookAt: lineRef(e),
    }),
  },
  {
    type: "IndexError",
    explain: (_, e) => ({
      title: "Position doesn't exist",
      explanation: "You asked for an item past the end of a list or string. Positions start at 0, so a list with 3 items has positions 0, 1 and 2.",
      lookAt: `${lineRef(e)}. Print \`len(...)\` of the list.`,
    }),
  },
  {
    type: "KeyError",
    message: /^'?(.*?)'?$/,
    explain: (m, e) => ({
      title: `No key ${m[1] ? `'${m[1]}'` : ""} in the dictionary`,
      explanation: "The dictionary has no entry with this key. Keys must match exactly (upper/lower case, spaces). Use `.get(key)` if the key might be missing.",
      lookAt: `${lineRef(e)}. Print the dictionary's keys with \`print(d.keys())\`.`,
    }),
  },
  {
    type: "AttributeError",
    message: /'(\w+)' object has no attribute '(\w+)'/,
    explain: (m, e) => ({
      title: `A ${m[1]} has no \`.${m[2]}\``,
      explanation: `\`.${m[2]}\` doesn't exist for a ${m[1]}. Check the spelling, and check that the variable holds the type you think it does.`,
      lookAt: lineRef(e),
    }),
  },
  {
    type: "FileNotFoundError",
    explain: (_, e) => ({
      title: "File not found",
      explanation: "There is no file with that name in the current folder. Check the spelling and the extension (.csv, .txt).",
      lookAt: lineRef(e),
    }),
  },
  {
    type: "ModuleNotFoundError",
    explain: (_, e) => ({
      title: "Unknown module",
      explanation: "Python can't find a module with that name. Check the spelling in the `import` line.",
      lookAt: lineRef(e),
    }),
  },
  {
    type: "RecursionError",
    explain: (_, e) => ({
      title: "A function keeps calling itself",
      explanation: "A function called itself so many times that Python gave up. It needs a case where it stops calling itself.",
      lookAt: lineRef(e),
    }),
  },
  {
    type: "EOFError",
    explain: () => ({
      title: "No input left",
      explanation: "The program called `input()` more times than there are input lines.",
      lookAt: "The Input box below the editor: add one line per input() call.",
    }),
  },
  {
    type: "AssertionError",
    explain: (_, e) => ({
      title: "A check (assert) failed",
      explanation: "An `assert` statement found that its condition is False. The code or the expectation is wrong.",
      lookAt: lineRef(e),
    }),
  },
  {
    type: "Timeout",
    explain: () => ({
      title: "The program took too long",
      explanation: "It was stopped after the time limit. Usually a `while` loop's condition never becomes False. Check that the variable in the condition changes inside the loop.",
      lookAt: "Your loops. Use the Trace button on a smaller example to watch the variables.",
    }),
  },
  {
    type: "OutputLimitExceeded",
    explain: () => ({
      title: "Way too much output",
      explanation: "The program printed an enormous amount of text, usually a `print` inside a loop that never ends.",
      lookAt: "Your loops.",
    }),
  },
  {
    type: "Stopped",
    explain: () => ({ title: "Stopped", explanation: "You stopped the program.", lookAt: "" }),
  },
];

export function translatePythonError(err: RunError): Translation {
  for (const rule of rules) {
    const typeOk = typeof rule.type === "string" ? rule.type === err.type : rule.type.test(err.type);
    if (!typeOk) continue;
    if (!rule.message) return rule.explain([] as unknown as RegExpMatchArray, err);
    const m = err.message.match(rule.message);
    if (m) return rule.explain(m, err);
  }
  return {
    title: err.type,
    explanation: "Python stopped with this error. Read the last line of the message: it names the problem. The line number tells you where.",
    lookAt: lineRef(err),
  };
}
