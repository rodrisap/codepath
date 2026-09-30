/**
 * The step-by-step trace: like a debugger, it shows which line runs, how each
 * value is calculated, and what every variable holds afterwards.
 *
 * Two views of the same data:
 *  - "Step" mode: one step at a time, with the current line highlighted.
 *  - "Table" mode: every step in one table.
 */
import { useEffect, useMemo, useState } from "react";
import type { TraceStep } from "../../runners/python/types";
import type { RunError } from "../../runners/types";
import { CodeBlock } from "../../components/CodeBlock";
import { Button } from "../../components/ui";
import { cx } from "../../lib/cx";
import { Icon } from "../../components/Icon";

interface TraceViewProps {
  code: string;
  steps: TraceStep[];
  error?: RunError | null;
  truncated?: boolean;
  /** Start in table mode (used for short traces). */
  initialMode?: "step" | "table";
  compact?: boolean;
}

function Vars({ step }: { step: TraceStep }) {
  const names = Object.keys(step.vars);
  if (!names.length) return <span className="text-faint">—</span>;
  return (
    <span className="flex flex-wrap gap-1">
      {names.map((name) => {
        const changed = step.changed.includes(name);
        return (
          <span
            key={name}
            className={cx(
              "rounded px-1.5 py-0.5 font-mono text-[0.78rem]",
              changed ? "bg-accent-soft text-fg ring-1 ring-accent/50" : "bg-surface-2 text-muted",
            )}
          >
            {changed && <span aria-hidden="true">★ </span>}
            {name} = {step.vars[name]}
            {changed && <span className="sr-only"> (changed)</span>}
          </span>
        );
      })}
    </span>
  );
}

function OutputText({ text }: { text: string }) {
  if (!text) return <span className="text-faint">—</span>;
  return <span className="whitespace-pre-wrap font-mono text-[0.8rem] text-success">{text.replace(/\n$/, "").replace(/\n/g, "⏎\n")}</span>;
}

export function TraceView({ code, steps, error, truncated, initialMode = "step", compact }: TraceViewProps) {
  const [mode, setMode] = useState<"step" | "table">(initialMode);
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [steps]);

  const step = steps[Math.min(index, steps.length - 1)];
  const outputSoFar = useMemo(() => steps.slice(0, index + 1).map((s) => s.output).join(""), [steps, index]);

  if (!steps.length) {
    return <p className="text-sm text-muted">Nothing to trace: {error ? "the code has an error before any line ran." : "no lines ran."}</p>;
  }

  return (
    <div className="@container space-y-3">
      <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Trace view">
        <div className="inline-flex rounded-lg border border-border p-0.5" role="group" aria-label="View mode">
          {(["step", "table"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={cx("rounded-md px-2.5 py-1 text-sm", mode === m ? "bg-surface-3 text-fg" : "text-muted hover:text-fg")}
            >
              {m === "step" ? "Step by step" : "Full table"}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted">
          {steps.length} steps · <span aria-hidden="true">★</span> marks a variable that just changed
        </span>
      </div>

      {mode === "step" ? (
        <div className={cx("grid gap-3", !compact && "@3xl:grid-cols-2")}>
          <CodeBlock code={code} activeLine={step.line} />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button size="sm" icon="chevronLeft" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} aria-label="Previous step">
                Prev
              </Button>
              <span className="min-w-24 whitespace-nowrap text-center text-sm tabular-nums text-muted" aria-live="polite">
                Step {index + 1} of {steps.length}
              </span>
              <Button size="sm" onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))} disabled={index >= steps.length - 1} aria-label="Next step" className="whitespace-nowrap">
                Next <Icon name="chevronRight" size={15} />
              </Button>
              <input
                type="range"
                min={0}
                max={steps.length - 1}
                value={index}
                onChange={(e) => setIndex(Number(e.target.value))}
                aria-label="Jump to step"
                className="ml-1 flex-1 accent-[var(--cp-accent)]"
              />
            </div>
            <dl className="space-y-2.5 rounded-xl border border-border bg-surface p-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-faint">
                  Line {step.line} {step.scope !== "main" && <>· inside {step.scope}()</>}
                </dt>
                <dd className="mt-0.5 font-mono text-[0.85rem]">{step.code}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-faint">What happens</dt>
                <dd className="mt-0.5 font-mono text-[0.85rem] text-accent">
                  {step.kind === "return-to" && <span className="mr-1 font-sans text-xs text-muted">(back from the call above)</span>}
                  {step.how ?? (step.output ? "prints output" : "runs the line")}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-faint">Variables after this step</dt>
                <dd className="mt-1">
                  <Vars step={step} />
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-faint">Output so far</dt>
                <dd className="mt-1 min-h-6 rounded-md bg-bg px-2 py-1">
                  <OutputText text={outputSoFar} />
                </dd>
              </div>
            </dl>
          </div>
        </div>
      ) : (
        <div className="max-h-[32rem] overflow-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">Every step of the program, in order</caption>
            <thead className="sticky top-0 bg-surface-2 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th scope="col" className="px-2 py-2">#</th>
                <th scope="col" className="px-2 py-2">Line</th>
                <th scope="col" className="px-2 py-2">What happens</th>
                <th scope="col" className="px-2 py-2">Variables after</th>
                <th scope="col" className="px-2 py-2">Prints</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s, i) => (
                <tr key={i} className={cx("border-t border-border align-top", s.scope !== "main" && "bg-surface-2/50")}>
                  <td className="px-2 py-1.5 tabular-nums text-faint">{i + 1}</td>
                  <td className="px-2 py-1.5">
                    <div className={cx("font-mono text-[0.8rem]", s.scope !== "main" && "border-l-2 border-accent pl-2")}>
                      <span className="text-faint">{s.line}</span> {s.code}
                    </div>
                    {s.scope !== "main" && <div className="pl-2.5 text-xs text-faint">in {s.scope}()</div>}
                  </td>
                  <td className="px-2 py-1.5 font-mono text-[0.8rem] text-accent">
                    {s.kind === "return-to" && <span className="mr-1 font-sans text-xs text-muted">↩ after the call:</span>}
                    {s.how ?? ""}
                  </td>
                  <td className="px-2 py-1.5">
                    <Vars step={s} />
                  </td>
                  <td className="px-2 py-1.5">
                    <OutputText text={s.output} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {truncated && <p className="text-xs text-warning">Only the first {steps.length} steps are shown.</p>}
    </div>
  );
}
