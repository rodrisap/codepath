import type { TestResult } from "../../runners/python/types";
import { Icon } from "../../components/Icon";
import { DoneCheck } from "../../components/ui";
import { Markdown } from "../../components/Markdown";
import { ErrorCard } from "./ErrorCard";

const cheers = [
  "That's it. Nicely done.",
  "Correct. On to the next one.",
  "Clean solution.",
  "All tests pass. Solid work.",
  "Exactly right.",
  "Works as intended. Well played.",
];

export function TestResults({ results, cheerSeed = 0 }: { results: TestResult[]; cheerSeed?: number }) {
  const passed = results.filter((r) => r.passed).length;
  const allPassed = passed === results.length && results.length > 0;
  // Show one full error explanation at most (the first), to keep the panel calm.
  const firstError = results.find((r) => !r.passed && r.error)?.error;
  return (
    <div className="space-y-3">
      {allPassed ? (
        <div className="flex items-center gap-3 rounded-xl border border-success/40 bg-success-soft px-3.5 py-3" role="status">
          <DoneCheck animate size={30} />
          <div>
            <p className="font-semibold text-success">All {results.length} tests passed</p>
            <p className="text-sm text-muted">{cheers[cheerSeed % cheers.length]}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted" role="status">
          {passed} of {results.length} tests passed. Read the first failing test below.
        </p>
      )}
      <ul className="space-y-1.5" aria-label="Test results">
        {results.map((r, i) => (
          <li key={i} className="flex gap-2.5 rounded-lg bg-surface-2 px-3 py-2 text-sm">
            <span className={r.passed ? "text-success" : "text-error"}>
              <Icon name={r.passed ? "check" : "x"} size={17} />
            </span>
            <div className="min-w-0">
              <p>
                <span className="sr-only">{r.passed ? "Passed: " : "Failed: "}</span>
                <Markdown inline source={r.label.includes("`") ? r.label : r.label.replace(/^(\w+\(.*?\))/, "`$1`")} />
              </p>
              {!r.passed && r.message && (
                <p className="mt-0.5 text-muted">
                  <Markdown inline source={r.message} />
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
      {firstError && <ErrorCard error={firstError} />}
    </div>
  );
}
