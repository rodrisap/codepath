/**
 * Simple spaced repetition (a Leitner system).
 * A question you answer comes back after 1 day. Each correct review moves it
 * to the next box (3, 7, then 21 days). A wrong answer sends it back to 1 day.
 */
import { addDays } from "./dates";
import type { ReviewCard } from "./schema";

export const INTERVALS = [1, 3, 7, 21];
export const MASTERED_BOX = INTERVALS.length;

export function newCard(today: string): ReviewCard {
  return { box: 0, due: addDays(today, INTERVALS[0]), reviews: 0, correct: 0 };
}

export function reviewCard(card: ReviewCard, correct: boolean, today: string): ReviewCard {
  const box = correct ? Math.min(card.box + 1, MASTERED_BOX) : 0;
  // Mastered cards still come back every 21 days, so they stay fresh.
  const interval = INTERVALS[Math.min(box, INTERVALS.length - 1)];
  return {
    box,
    due: addDays(today, interval),
    reviews: card.reviews + 1,
    correct: card.correct + (correct ? 1 : 0),
    lastReviewed: today,
  };
}

export function isDue(card: ReviewCard, today: string): boolean {
  return card.due <= today;
}
