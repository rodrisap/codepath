/**
 * Quick-check questions at the end of a lesson. Your first answer is saved and
 * the question joins the Review queue (spaced repetition).
 */
import { useState } from "react";
import type { QuizItem } from "../../content/types";
import { Markdown } from "../../components/Markdown";
import { CodeBlock } from "../../components/CodeBlock";
import { Button, Card } from "../../components/ui";
import { Icon } from "../../components/Icon";
import { cx } from "../../lib/cx";

const kindLabel = { predict: "Predict the output", bug: "Spot the bug", choice: "Multiple choice" } as const;

export function QuizQuestion({
  item,
  number,
  onAnswer,
  initialAnswer,
}: {
  item: QuizItem;
  number?: number;
  onAnswer: (correct: boolean) => void;
  initialAnswer?: number | null;
}) {
  const [picked, setPicked] = useState<number | null>(initialAnswer ?? null);
  const [submitted, setSubmitted] = useState(initialAnswer != null);
  const correct = picked === item.answer;
  const groupName = `q-${item.id}-${number ?? "r"}`;

  return (
    <Card className="p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {number != null && <>Question {number} · </>}
        {kindLabel[item.kind]}
      </p>
      <fieldset className="mt-1.5">
        <legend className="font-medium">
          <Markdown inline source={item.question} />
        </legend>
        {item.code && <CodeBlock code={item.code} className="mt-3" />}
        {item.stdin && <p className="mt-1 text-xs text-muted">Input typed: {item.stdin.map((s) => `"${s}"`).join(", ")}</p>}
        <div className="mt-3 space-y-1.5">
          {item.options.map((option, i) => {
            const isAnswer = i === item.answer;
            const isPicked = i === picked;
            return (
              <label
                key={i}
                className={cx(
                  "flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2 text-sm",
                  submitted && isAnswer && "border-success/60 bg-success-soft",
                  submitted && isPicked && !isAnswer && "border-error/60 bg-error-soft",
                  !submitted && isPicked && "border-accent bg-accent-soft",
                  !(submitted && (isAnswer || isPicked)) && !(!submitted && isPicked) && "border-border hover:bg-surface-2",
                  submitted && "cursor-default",
                )}
              >
                <input
                  type="radio"
                  name={groupName}
                  className="mt-1 accent-[var(--cp-accent)]"
                  checked={isPicked}
                  disabled={submitted}
                  onChange={() => setPicked(i)}
                />
                <span className="min-w-0 flex-1">
                  {option.includes("\n") ? <pre className="whitespace-pre-wrap font-mono text-[0.82rem]">{option}</pre> : <Markdown inline source={option} />}
                </span>
                {submitted && isAnswer && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-success">
                    <Icon name="check" size={14} /> Correct answer
                  </span>
                )}
                {submitted && isPicked && !isAnswer && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-error">
                    <Icon name="x" size={14} /> Your answer
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>
      {!submitted ? (
        <Button
          className="mt-3"
          size="sm"
          variant="primary"
          disabled={picked === null}
          onClick={() => {
            setSubmitted(true);
            onAnswer(picked === item.answer);
          }}
        >
          Check answer
        </Button>
      ) : (
        <div className={cx("mt-3 rounded-lg px-3 py-2 text-sm", correct ? "bg-success-soft" : "bg-surface-2")} role="status">
          <p className={cx("font-semibold", correct ? "text-success" : "text-error")}>{correct ? "Right." : "Not quite."}</p>
          <Markdown source={item.explanation} />
        </div>
      )}
    </Card>
  );
}
