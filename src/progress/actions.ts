/**
 * Every change to progress goes through one of these small functions, so the
 * rules (when is a lesson complete? what counts as "first try"?) live in one place.
 */
import { bumpActivity, updateProgress } from "./store";
import { emptyExercise, emptyLesson, type ProgressData } from "./schema";
import { toDay } from "./dates";
import { newCard, reviewCard } from "./review";

function lesson(draft: ProgressData, path: string) {
  return (draft.lessons[path] ??= emptyLesson());
}

function exercise(draft: ProgressData, path: string, id: string) {
  return (lesson(draft, path).exercises[id] ??= emptyExercise());
}

export function markVisited(path: string) {
  updateProgress((d) => {
    lesson(d, path).lastVisited = new Date().toISOString();
    d.lastLesson = path;
  });
}

export function saveExerciseCode(path: string, id: string, code: string) {
  updateProgress((d) => {
    exercise(d, path, id).code = code;
  });
}

export function saveTryItCode(path: string, code: string) {
  updateProgress((d) => {
    lesson(d, path).tryItCode = code;
  });
}

export function saveNotes(path: string, notes: string) {
  updateProgress((d) => {
    lesson(d, path).notes = notes;
  });
}

export function revealHint(path: string, id: string, count: number) {
  updateProgress((d) => {
    const ex = exercise(d, path, id);
    ex.hintsShown = Math.max(ex.hintsShown, count);
  });
}

export function giveUp(path: string, id: string) {
  updateProgress((d) => {
    exercise(d, path, id).gaveUp = true;
  });
}

/** Record a press of Check. Returns true when this pass completed the whole lesson. */
export function recordCheck(path: string, id: string, allPassed: boolean, allExerciseIds: string[]): boolean {
  let lessonJustCompleted = false;
  updateProgress((d) => {
    const ex = exercise(d, path, id);
    ex.attempts += 1;
    if (allPassed && !ex.passed) {
      ex.passed = true;
      ex.passedAt = new Date().toISOString();
      ex.firstTry = ex.attempts === 1 && ex.hintsShown === 0 && !ex.gaveUp;
      bumpActivity(d, "exercises");
      const l = lesson(d, path);
      const done = allExerciseIds.every((e) => l.exercises[e]?.passed);
      if (done && !l.completedAt) {
        l.completedAt = new Date().toISOString();
        bumpActivity(d, "lessons");
        lessonJustCompleted = true;
      }
    }
  });
  return lessonJustCompleted;
}

/** First answer to a quick-check question: remember it and schedule it for review. */
export function answerQuiz(path: string, questionId: string, correct: boolean) {
  updateProgress((d) => {
    const l = lesson(d, path);
    if (l.quiz[questionId]) return;
    l.quiz[questionId] = { correct, answeredAt: new Date().toISOString() };
    const cardId = `${path}#${questionId}`;
    d.review[cardId] ??= newCard(toDay());
  });
}

export function answerReview(cardId: string, correct: boolean) {
  updateProgress((d) => {
    const card = d.review[cardId];
    if (!card) return;
    d.review[cardId] = reviewCard(card, correct, toDay());
    bumpActivity(d, "reviews");
  });
}

/** Lessons without exercises (rare) count as done once opened. */
export function completeWithoutExercises(path: string) {
  updateProgress((d) => {
    const l = lesson(d, path);
    if (!l.completedAt) {
      l.completedAt = new Date().toISOString();
      bumpActivity(d, "lessons");
    }
  });
}
