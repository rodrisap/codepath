/**
 * Everything CodePath remembers about you, in one object. It is saved in the
 * browser (IndexedDB) and can be exported/imported as a JSON file.
 *
 * `version` lets future updates migrate old saves instead of losing them.
 */
export const PROGRESS_VERSION = 1;

export interface ExerciseProgress {
  passed: boolean;
  passedAt?: string;
  /** How many times you pressed Check. */
  attempts: number;
  hintsShown: number;
  gaveUp: boolean;
  /** Passed on the first Check, without hints or the solution. */
  firstTry: boolean;
  code?: string;
}

export interface LessonProgress {
  completedAt?: string;
  exercises: Record<string, ExerciseProgress>;
  quiz: Record<string, { correct: boolean; answeredAt: string }>;
  notes?: string;
  tryItCode?: string;
  lastVisited?: string;
}

/** A spaced-repetition card for one quick-check question. */
export interface ReviewCard {
  /** 0–3 = waiting for the 1/3/7/21-day review, 4 = mastered. */
  box: number;
  due: string;
  reviews: number;
  correct: number;
  lastReviewed?: string;
}

export interface DayActivity {
  exercises: number;
  reviews: number;
  lessons: number;
}

export type ThemeName = "dark" | "warm";

export interface Settings {
  theme: ThemeName;
  fontSize: 16 | 17 | 18;
  /** Time limit for one run, in seconds. */
  timeoutSec: number;
}

export interface ProgressData {
  version: number;
  createdAt: string;
  /** Keyed by lesson path, e.g. "python/loops/for-loops". */
  lessons: Record<string, LessonProgress>;
  /** Keyed by "lessonPath#questionId". */
  review: Record<string, ReviewCard>;
  /** Keyed by day ("2026-09-30"). */
  activity: Record<string, DayActivity>;
  settings: Settings;
  playground: { python: string; sql: string; dataset: string };
  lastLesson?: string;
}

export function emptyProgress(): ProgressData {
  return {
    version: PROGRESS_VERSION,
    createdAt: new Date().toISOString(),
    lessons: {},
    review: {},
    activity: {},
    settings: { theme: "dark", fontSize: 17, timeoutSec: 5 },
    playground: {
      python: '# Free coding space: anything goes.\nprint("Hello from the playground!")\n',
      sql: "SELECT * FROM rooms;\n",
      dataset: "motel",
    },
  };
}

export function emptyExercise(): ExerciseProgress {
  return { passed: false, attempts: 0, hintsShown: 0, gaveUp: false, firstTry: false };
}

export function emptyLesson(): LessonProgress {
  return { exercises: {}, quiz: {} };
}

/**
 * Bring any saved/imported object up to the current version.
 * Unknown or missing fields are filled with defaults so old saves keep working.
 */
export function migrate(raw: unknown): ProgressData {
  const base = emptyProgress();
  if (!raw || typeof raw !== "object") return base;
  const data = raw as Partial<ProgressData>;
  if (typeof data.version !== "number" || data.version > PROGRESS_VERSION) {
    throw new Error("This progress file was made by a newer version of CodePath, or is not a progress file.");
  }
  // Version 1 is the first format; future migrations go here, e.g.
  // if (data.version === 1) { ...convert to 2...; data.version = 2; }
  return {
    ...base,
    ...data,
    version: PROGRESS_VERSION,
    settings: { ...base.settings, ...(data.settings ?? {}) },
    playground: { ...base.playground, ...(data.playground ?? {}) },
    lessons: data.lessons ?? {},
    review: data.review ?? {},
    activity: data.activity ?? {},
  };
}
