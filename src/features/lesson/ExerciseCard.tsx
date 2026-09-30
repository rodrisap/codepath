/**
 * One exercise in the lesson text: the task, its status, hints revealed one
 * at a time, and the solution (after you pass, or if you choose to give up).
 */
import { useState } from "react";
import type { Exercise } from "../../content/types";
import type { ExerciseProgress } from "../../progress/schema";
import { giveUp, revealHint } from "../../progress/actions";
import { Markdown } from "../../components/Markdown";
import { CodeBlock } from "../../components/CodeBlock";
import { Badge, Button, Card, DoneCheck } from "../../components/ui";
import { Icon } from "../../components/Icon";
import { cx } from "../../lib/cx";

const hintNames = ["Nudge", "Stronger hint", "Almost the answer"];

export function ExerciseCard({
  lessonPath,
  number,
  exercise,
  progress,
  active,
  onOpen,
  onLoadSolution,
}: {
  lessonPath: string;
  number: number;
  exercise: Exercise;
  progress?: ExerciseProgress;
  active: boolean;
  onOpen: () => void;
  onLoadSolution: () => void;
}) {
  const hintsShown = progress?.hintsShown ?? 0;
  const passed = !!progress?.passed;
  const solutionUnlocked = passed || !!progress?.gaveUp;
  const [confirming, setConfirming] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <Card className={cx("p-4 sm:p-5", active && "ring-1 ring-accent/60")} id={`exercise-${exercise.id}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="flex items-center gap-2 font-semibold">
          {passed ? <DoneCheck /> : <span className="grid size-[18px] place-items-center rounded-full border border-faint text-[0.65rem] text-muted">{number}</span>}
          Exercise {number}: {exercise.title}
        </h3>
        {passed ? (
          <Badge tone="success">
            <Icon name="check" size={13} /> Passed{progress?.firstTry ? " first try" : ""}
          </Badge>
        ) : (
          <Badge>To do</Badge>
        )}
      </div>

      <Markdown source={exercise.prompt} className="mt-3" />

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant={active ? "secondary" : "primary"} icon="code" onClick={onOpen} size="sm">
          {active ? "Open in the editor" : "Work on this"}
        </Button>
      </div>

      {/* Hints: revealed one at a time */}
      <div className="mt-4 space-y-2">
        {exercise.hints.slice(0, hintsShown).map((hint, i) => (
          <div key={i} className="rounded-lg border border-warning/30 bg-warning-soft px-3 py-2 text-sm">
            <p className="mb-0.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-warning">
              <Icon name="hint" size={14} /> {hintNames[i]}
            </p>
            <Markdown source={hint} />
          </div>
        ))}
        {!passed && hintsShown < 3 && (
          <Button variant="ghost" size="sm" icon="hint" onClick={() => revealHint(lessonPath, exercise.id, hintsShown + 1)}>
            {hintsShown === 0 ? "Show a hint" : `Show the next hint (${hintsShown + 1} of 3)`}
          </Button>
        )}
      </div>

      {/* Solution */}
      <div className="mt-3 border-t border-border pt-3">
        {solutionUnlocked ? (
          showSolution ? (
            <div className="space-y-3">
              <CodeBlock code={exercise.solution.code} label="A model solution" />
              <Markdown source={exercise.solution.explanation} className="text-[0.95rem]" />
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setShowSolution(false)}>
                  Hide solution
                </Button>
                {!passed && (
                  <Button size="sm" variant="ghost" icon="code" onClick={onLoadSolution}>
                    Copy into the editor
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <Button size="sm" variant="ghost" icon="eye" onClick={() => setShowSolution(true)}>
              {passed ? "Compare with the model solution" : "Show the solution"}
            </Button>
          )
        ) : confirming ? (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">Sure? Trying one more hint first often helps.</span>
            <Button
              size="sm"
              onClick={() => {
                giveUp(lessonPath, exercise.id);
                setShowSolution(true);
                setConfirming(false);
              }}
            >
              Yes, show it
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
              Keep trying
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="ghost" icon="lock" onClick={() => setConfirming(true)}>
            Give up & see the solution
          </Button>
        )}
      </div>
    </Card>
  );
}
