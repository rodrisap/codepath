import { getProgress, replaceProgress } from "./store";
import { migrate } from "./schema";
import { toDay } from "./dates";

/** Download all progress as a JSON file. */
export function exportProgress() {
  const blob = new Blob([JSON.stringify(getProgress(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `codepath-progress-${toDay()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Read a previously exported file and replace the current progress with it. */
export async function importProgress(file: File): Promise<void> {
  const text = await file.text();
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error("That file isn't valid JSON.");
  }
  replaceProgress(migrate(raw));
}
