import { useEffect, useState } from "react";
import { saveNotes } from "../../progress/actions";
import { Card } from "../../components/ui";

/** A small personal notes box, saved with your progress (and in exports). */
export function LessonNotes({ path, initial }: { path: string; initial: string }) {
  const [text, setText] = useState(initial);
  useEffect(() => setText(initial), [path]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Card className="p-4">
      <label htmlFor="lesson-notes" className="text-sm font-semibold">
        My notes for this lesson
      </label>
      <textarea
        id="lesson-notes"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          saveNotes(path, e.target.value);
        }}
        rows={4}
        placeholder="Anything you want to remember: a trick, a question, a link…"
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3 py-2 text-sm"
      />
      <p className="mt-1 text-xs text-faint">Saved automatically.</p>
    </Card>
  );
}
