/**
 * The workbench: editor + Run / Check / Trace buttons + output.
 * A lesson shows one workbench with a tab per task ("Try it", "Exercise 1", …).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { PyTest } from "../../content/types";
import type { RunError } from "../../runners/types";
import type { TestResult, TraceResult } from "../../runners/python/types";
import { canShareMemory, getPythonRunner, type RunnerStatus } from "../../runners/python/PythonRunner";
import { runSourceTests } from "../../checking/sourceTests";
import { saveNow } from "../../progress/store";
import { Button, DoneCheck, Kbd, modKey } from "../../components/ui";
import { Icon } from "../../components/Icon";
import { cx } from "../../lib/cx";
import { CodeEditor } from "./CodeEditor";
import { Console, type Chunk } from "./Console";
import { ErrorCard } from "./ErrorCard";
import { TestResults } from "./TestResults";
import { TraceView } from "../trace/TraceView";

export interface WorkTab {
  key: string;
  label: string;
  passed?: boolean;
}

export interface WorkTarget {
  key: string;
  title: string;
  code: string;
  starter: string;
  onCodeChange: (code: string) => void;
  stdin?: string[];
  files?: Record<string, string>;
  /** When present, the Check button runs these tests. */
  tests?: PyTest[];
  onChecked?: (results: TestResult[], allPassed: boolean) => void;
}

type Mode = "output" | "tests" | "trace";

export function useRunnerStatus(): RunnerStatus {
  const runner = getPythonRunner();
  const [status, setStatus] = useState(runner.status);
  useEffect(() => runner.onStatus(setStatus), [runner]);
  return status;
}

export function Workbench({ tabs, activeKey, onSelectTab, target }: { tabs: WorkTab[]; activeKey: string; onSelectTab: (key: string) => void; target: WorkTarget }) {
  return (
    <section aria-label="Code workbench" className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
      {tabs.length > 1 && (
        <div role="tablist" aria-label="Tasks" className="flex gap-1 overflow-x-auto border-b border-border bg-surface-2/60 px-2 pt-2">
          {tabs.map((t) => {
            const active = t.key === activeKey;
            return (
              <button
                key={t.key}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => onSelectTab(t.key)}
                className={cx(
                  "flex shrink-0 items-center gap-1.5 rounded-t-lg border border-b-0 px-3 py-1.5 text-sm",
                  active ? "border-border bg-surface text-fg" : "border-transparent text-muted hover:text-fg",
                )}
              >
                {t.passed && <DoneCheck size={15} />}
                {t.label}
                {t.passed && <span className="sr-only"> (done)</span>}
              </button>
            );
          })}
        </div>
      )}
      <WorkbenchPanel key={target.key} target={target} />
    </section>
  );
}

function WorkbenchPanel({ target }: { target: WorkTarget }) {
  const runner = getPythonRunner();
  const status = useRunnerStatus();
  const [mode, setMode] = useState<Mode>("output");
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [error, setError] = useState<RunError | null>(null);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [trace, setTrace] = useState<TraceResult | null>(null);
  const [busy, setBusy] = useState<null | "run" | "check" | "trace">(null);
  const [statusText, setStatusText] = useState("");
  const [prompt, setPrompt] = useState<string | null>(null);
  const [checks, setChecks] = useState(0);
  const answerInput = useRef<((v: string | null) => void) | null>(null);

  const usesInput = /\binput\s*\(/.test(target.code);
  const [inputText, setInputText] = useState(() => (!canShareMemory && target.stdin ? target.stdin.join("\n") : ""));
  const inputLines = () => (inputText.trim() === "" ? [] : inputText.replace(/\n$/, "").split("\n"));

  // Start loading Python as soon as a workbench is on screen.
  useEffect(() => {
    runner.ready().catch(() => {});
  }, [runner]);

  const run = useCallback(async () => {
    if (busy) return;
    setMode("output");
    setChunks([]);
    setError(null);
    setBusy("run");
    try {
      const result = await runner.run(
        target.code,
        { stdin: inputLines(), files: target.files },
        {
          onStream: (kind, text) =>
            setChunks((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.kind === kind) return [...prev.slice(0, -1), { kind, text: last.text + text }];
              return [...prev, { kind, text }];
            }),
          onInputRequest: (p) =>
            new Promise<string | null>((resolve) => {
              answerInput.current = resolve;
              setPrompt(p);
            }),
          onStatus: setStatusText,
        },
      );
      setError(result.error ?? null);
    } catch (err) {
      setError({ type: "Error", message: String(err) });
    } finally {
      setBusy(null);
      setPrompt(null);
      setStatusText("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, runner, target.code, target.files, inputText]);

  const check = useCallback(async () => {
    if (busy || !target.tests) return;
    setMode("tests");
    setBusy("check");
    setResults(null);
    try {
      const fromPython = await runner.check(target.code, target.tests, { stdin: target.stdin, files: target.files }, { onStatus: setStatusText });
      const all = [...fromPython, ...runSourceTests(target.code, target.tests)];
      setResults(all);
      setChecks((c) => c + 1);
      target.onChecked?.(all, all.every((r) => r.passed));
    } catch (err) {
      setResults([{ label: "Running the tests", passed: false, message: String(err) }]);
    } finally {
      setBusy(null);
      setStatusText("");
    }
  }, [busy, runner, target]);

  const runTrace = useCallback(async () => {
    if (busy) return;
    setMode("trace");
    setBusy("trace");
    try {
      setTrace(await runner.trace(target.code, { stdin: inputLines(), files: target.files }, { onStatus: setStatusText }));
    } finally {
      setBusy(null);
      setStatusText("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, runner, target.code, target.files, inputText]);

  const stop = () => {
    answerInput.current?.(null);
    answerInput.current = null;
    setPrompt(null);
    runner.stop();
  };

  // Ctrl/Cmd+Enter anywhere on the page runs the code (the editor handles it itself when focused).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || !(e.ctrlKey || e.metaKey) || e.key !== "Enter") return;
      e.preventDefault();
      if (e.shiftKey && target.tests) void check();
      else void run();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [run, check, target.tests]);

  const errorLine =
    mode === "output" ? error?.line : mode === "tests" ? results?.find((r) => !r.passed && r.error?.line)?.error?.line : trace?.error?.line;

  const loading = status === "loading" || status === "idle";

  return (
    <div className="flex min-h-0 flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <h3 className="truncate text-sm font-semibold">{target.title}</h3>
        <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted" aria-live="polite" title="The first load takes a few seconds; after that it is cached">
          {status === "error" ? (
            <span className="text-error">Python failed to load. Check your connection and reload.</span>
          ) : loading ? (
            <>
              <span className="size-2 animate-pulse rounded-full bg-warning" aria-hidden="true" /> Loading Python…
            </>
          ) : (
            <>
              <span className="size-2 rounded-full bg-success" aria-hidden="true" /> Python ready
            </>
          )}
        </span>
      </div>

      <div className="h-[clamp(14rem,38vh,26rem)] border-b border-border">
        <CodeEditor
          value={target.code}
          onChange={target.onCodeChange}
          language="python"
          onRun={() => void run()}
          onSave={() => void saveNow()}
          errorLine={errorLine}
          ariaLabel={`Code editor: ${target.title}`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5">
        {busy === "run" ? (
          <Button variant="secondary" icon="stop" onClick={stop}>
            Stop
          </Button>
        ) : (
          <Button variant="primary" icon="play" onClick={() => void run()} disabled={!!busy} title={`Run (${modKey}+Enter)`}>
            Run
          </Button>
        )}
        {target.tests && (
          <Button variant="success" icon="check" onClick={() => void check()} disabled={!!busy} title={`Check (${modKey}+Shift+Enter)`}>
            {busy === "check" ? "Checking…" : "Check"}
          </Button>
        )}
        <Button icon="trace" onClick={() => void runTrace()} disabled={!!busy} title="Run step by step and see every variable">
          Trace
        </Button>
        <Button
          variant="ghost"
          icon="reset"
          onClick={() => {
            if (target.code === target.starter || confirm("Replace your code with the starting code?")) target.onCodeChange(target.starter);
          }}
          disabled={!!busy}
        >
          Reset
        </Button>
        <span className="ml-auto hidden text-xs text-faint sm:inline">
          <Kbd>{modKey}</Kbd> <Kbd>Enter</Kbd> run {target.tests && <> · <Kbd>Shift</Kbd> too to check</>}
        </span>
      </div>

      {(usesInput || inputText) && (
        <div className="px-3 pb-2.5">
          <label htmlFor={`stdin-${target.key}`} className="mb-1 block text-xs text-muted">
            {canShareMemory
              ? "Pre-typed input (optional). Leave empty and the program will ask you while it runs."
              : "Program input: type one line for each input() call, before you press Run."}
          </label>
          <textarea
            id={`stdin-${target.key}`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={2}
            spellCheck={false}
            className="w-full resize-y rounded-lg border border-border bg-bg px-2.5 py-1.5 font-mono text-sm"
          />
        </div>
      )}

      <div className="border-t border-border px-3 pt-2 pb-3">
        <div className="mb-2 flex items-center gap-1" role="group" aria-label="Show">
          {(["output", "tests", "trace"] as const)
            .filter((m) => m !== "tests" || target.tests)
            .map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={cx("rounded-md px-2.5 py-1 text-sm", mode === m ? "bg-surface-3 text-fg" : "text-muted hover:text-fg")}
              >
                {m === "tests" ? "Test results" : m === "trace" ? "Steps" : "Output"}
              </button>
            ))}
          {statusText && <span className="ml-2 text-xs text-muted">{statusText}</span>}
        </div>

        {mode === "output" && (
          <div className="space-y-3">
            <Console
              chunks={chunks}
              pendingPrompt={prompt}
              onSubmitInput={(v) => {
                answerInput.current?.(v);
                answerInput.current = null;
                setPrompt(null);
              }}
            />
            {error && <ErrorCard error={error} />}
          </div>
        )}
        {mode === "tests" &&
          (results ? (
            <TestResults results={results} cheerSeed={checks} />
          ) : (
            <p className="text-sm text-muted">{busy === "check" ? "Running the tests…" : "Press Check to test your code."}</p>
          ))}
        {mode === "trace" &&
          (trace ? (
            <div className="space-y-3">
              <TraceView code={target.code} steps={trace.steps} error={trace.error} truncated={trace.truncated} compact />
              {trace.error && <ErrorCard error={trace.error} />}
            </div>
          ) : (
            <p className="flex items-center gap-2 text-sm text-muted">
              <Icon name="trace" /> {busy === "trace" ? "Tracing…" : "Press Trace to run your code one step at a time."}
            </p>
          ))}
      </div>
    </div>
  );
}
