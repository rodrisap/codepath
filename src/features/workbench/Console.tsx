/**
 * The output console: shows what the program printed, the input you typed
 * (in a different style and marked "input"), and an input box when the
 * program is waiting for input().
 */
import { useEffect, useRef, useState } from "react";
import type { StreamKind } from "../../runners/types";
import { cx } from "../../lib/cx";

export interface Chunk {
  kind: StreamKind;
  text: string;
}

export function Console({
  chunks,
  pendingPrompt,
  onSubmitInput,
  emptyText = "Run your code to see the output here.",
}: {
  chunks: Chunk[];
  pendingPrompt: string | null;
  onSubmitInput: (value: string) => void;
  emptyText?: string;
}) {
  const [value, setValue] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pendingPrompt !== null) input.current?.focus();
  }, [pendingPrompt]);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [chunks, pendingPrompt]);

  return (
    <div className="max-h-80 min-h-24 overflow-auto rounded-xl border border-border bg-bg p-3 font-mono text-[0.84rem] leading-relaxed" aria-live="polite" aria-label="Program output">
      {chunks.length === 0 && pendingPrompt === null && <span className="font-sans text-sm text-faint">{emptyText}</span>}
      <span className="whitespace-pre-wrap break-words">
        {chunks.map((c, i) => (
          <span
            key={i}
            className={cx(c.kind === "err" && "text-error", c.kind === "in" && "rounded bg-accent-soft px-0.5 text-accent")}
            title={c.kind === "in" ? "You typed this" : undefined}
          >
            {c.kind === "in" && <span className="sr-only">(input) </span>}
            {c.text}
          </span>
        ))}
      </span>
      {pendingPrompt !== null && (
        <form
          className="mt-1 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitInput(value);
            setValue("");
          }}
        >
          <label className="sr-only" htmlFor="console-input">
            Input for the program{pendingPrompt ? `: ${pendingPrompt}` : ""}
          </label>
          <span className="text-accent" aria-hidden="true">›</span>
          <input
            id="console-input"
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 rounded-md border border-accent/60 bg-surface px-2 py-1 font-mono text-fg outline-none focus:border-accent"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="font-sans text-xs text-muted">Enter ↵</span>
        </form>
      )}
      <div ref={end} />
    </div>
  );
}
