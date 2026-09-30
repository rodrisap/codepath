import { useMemo } from "react";
import { highlightLines, type CodeLang } from "../lib/highlight";
import { cx } from "../lib/cx";

/**
 * Read-only code with line numbers. `activeLine` highlights one line
 * (used by the step-by-step trace to show where execution is).
 */
export function CodeBlock({
  code,
  lang = "python",
  activeLine,
  className,
  label,
}: {
  code: string;
  lang?: CodeLang;
  activeLine?: number | null;
  className?: string;
  label?: string;
}) {
  const lines = useMemo(() => highlightLines(code.replace(/\n$/, ""), lang), [code, lang]);
  return (
    <figure className={cx("overflow-hidden rounded-xl border border-border bg-surface", className)}>
      {label && <figcaption className="border-b border-border px-4 py-1.5 text-xs font-medium text-muted">{label}</figcaption>}
      <pre className="overflow-x-auto py-3 font-mono text-[0.85rem] leading-[1.65]">
        <code>
          {lines.map((html, i) => {
            const n = i + 1;
            const active = n === activeLine;
            return (
              <div
                key={i}
                className={cx("flex pr-4", active && "bg-accent-soft")}
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={cx(
                    "w-10 shrink-0 select-none pr-3 text-right",
                    active ? "font-semibold text-accent" : "text-faint",
                  )}
                  aria-hidden="true"
                >
                  {active ? "▸" : ""}
                  {n}
                </span>
                <span className="whitespace-pre" dangerouslySetInnerHTML={{ __html: html || " " }} />
              </div>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}
