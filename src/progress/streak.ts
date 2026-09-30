import { addDays } from "./dates";
import type { DayActivity } from "./schema";

const active = (a?: DayActivity) => !!a && a.exercises + a.reviews + a.lessons > 0;

/**
 * Days in a row with at least one passed exercise or review.
 * If you haven't studied yet today, yesterday's streak still counts.
 */
export function currentStreak(activity: Record<string, DayActivity>, today: string): number {
  let day = active(activity[today]) ? today : addDays(today, -1);
  let streak = 0;
  while (active(activity[day])) {
    streak++;
    day = addDays(day, -1);
  }
  return streak;
}

export function longestStreak(activity: Record<string, DayActivity>): number {
  const days = Object.keys(activity).filter((d) => active(activity[d])).sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of days) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}
