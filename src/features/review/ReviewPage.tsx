/**
 * Review: quick-check questions from earlier lessons come back after
 * 1, 3, 7 and 21 days (spaced repetition). A wrong answer resets it to 1 day.
 */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { findLesson, loadLessonData } from "../../content/registry";
import type { QuizItem } from "../../content/types";
import { getProgress, useProgress } from "../../progress/store";
import { answerReview } from "../../progress/actions";
import { INTERVALS, MASTERED_BOX, isDue } from "../../progress/review";
import { toDay } from "../../progress/dates";
import { Button, Card } from "../../components/ui";
import { QuizQuestion } from "../lesson/QuickCheck";

interface DueItem {
  cardId: string;
  lessonTitle: string;
  lessonPath: string;
  item: QuizItem;
}

export function ReviewPage() {
  const review = useProgress((p) => p.review);
  const today = toDay();
  // The queue is fixed when the page opens, so answering doesn't reshuffle it.
  const [queue, setQueue] = useState<DueItem[] | null>(null);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState({ right: 0, total: 0 });

  useEffect(() => {
    const due = Object.entries(getProgress().review).filter(([, c]) => isDue(c, today));
    Promise.all(
      due.map(async ([cardId]) => {
        const [lessonPath, qid] = cardId.split("#");
        const data = await loadLessonData(lessonPath);
        const item = data?.quiz.find((q) => q.id === qid);
        const loc = findLesson(lessonPath);
        return item && loc ? { cardId, lessonTitle: loc.lesson.title, lessonPath, item } : null;
      }),
    ).then((items) => setQueue(items.filter((x): x is DueItem => !!x)));
  }, [today]);

  const boxes = useMemo(() => {
    const counts = Array(MASTERED_BOX + 1).fill(0) as number[];
    Object.values(review).forEach((c) => counts[c.box]++);
    return counts;
  }, [review]);
  const nextDue = Object.values(review)
    .map((c) => c.due)
    .filter((d) => d > today)
    .sort()[0];

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Review</h1>
        <p className="mt-1 text-muted">Questions come back after 1, 3, 7 and 21 days. Get one wrong and it starts again at 1 day.</p>
      </div>

      <div className="grid grid-cols-5 gap-2 text-center text-sm" aria-label="Cards per stage">
        {boxes.map((n, i) => (
          <Card key={i} className="p-2.5">
            <p className="text-lg font-semibold tabular-nums">{n}</p>
            <p className="text-xs text-muted">{i < MASTERED_BOX ? `next in ${INTERVALS[i]}d` : "mastered"}</p>
          </Card>
        ))}
      </div>

      {queue === null ? (
        <p className="text-muted">Loading…</p>
      ) : index >= queue.length ? (
        <Card className="p-6 text-center">
          {queue.length ? (
            <>
              <p className="text-lg font-semibold">Review done: {score.right} of {score.total} right.</p>
              <p className="mt-1 text-muted">See you tomorrow.</p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold">Nothing to review right now.</p>
              <p className="mt-1 text-muted">
                {nextDue ? `Next review: ${nextDue}.` : "Answer the quick-check questions at the end of each lesson and they'll show up here."}
              </p>
            </>
          )}
          <Link to="/" className="mt-4 inline-block text-accent hover:underline">
            Back to the dashboard
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted">
            {index + 1} of {queue.length} · from{" "}
            <Link to={`/learn/${queue[index].lessonPath}`} className="text-accent hover:underline">
              {queue[index].lessonTitle}
            </Link>
          </p>
          <QuizQuestion
            key={queue[index].cardId}
            item={queue[index].item}
            onAnswer={(correct) => {
              answerReview(queue[index].cardId, correct);
              setScore((s) => ({ right: s.right + (correct ? 1 : 0), total: s.total + 1 }));
              setAnswered(true);
            }}
          />
          {answered && (
            <Button
              variant="primary"
              onClick={() => {
                setIndex((i) => i + 1);
                setAnswered(false);
              }}
            >
              {index + 1 < queue.length ? "Next question" : "Finish"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
