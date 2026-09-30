import { describe, expect, it } from "vitest";
import { addDays, daysBetween } from "../../src/progress/dates";
import { INTERVALS, isDue, newCard, reviewCard } from "../../src/progress/review";
import { currentStreak, longestStreak } from "../../src/progress/streak";
import { emptyProgress, migrate } from "../../src/progress/schema";

describe("dates", () => {
  it("adds days across month and year boundaries", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(daysBetween("2026-09-30", "2026-10-21")).toBe(21);
  });
});

describe("spaced repetition", () => {
  it("follows the 1 → 3 → 7 → 21 day ladder", () => {
    const today = "2026-09-30";
    let card = newCard(today);
    expect(card.due).toBe("2026-10-01");
    const expectedGaps = [3, 7, 21, 21];
    let day = card.due;
    for (const gap of expectedGaps) {
      card = reviewCard(card, true, day);
      expect(daysBetween(day, card.due)).toBe(gap);
      day = card.due;
    }
    expect(card.box).toBe(INTERVALS.length); // mastered
  });

  it("sends a card back to 1 day after a wrong answer", () => {
    let card = newCard("2026-09-30");
    card = reviewCard(card, true, "2026-10-01");
    card = reviewCard(card, false, "2026-10-04");
    expect(card.box).toBe(0);
    expect(card.due).toBe("2026-10-05");
    expect(card.reviews).toBe(2);
    expect(card.correct).toBe(1);
  });

  it("knows when a card is due", () => {
    const card = newCard("2026-09-30");
    expect(isDue(card, "2026-09-30")).toBe(false);
    expect(isDue(card, "2026-10-01")).toBe(true);
    expect(isDue(card, "2026-10-09")).toBe(true);
  });
});

describe("streak", () => {
  const act = (n: number) => ({ exercises: n, reviews: 0, lessons: 0 });
  it("counts consecutive days, and keeps yesterday's streak alive today", () => {
    const activity = { "2026-09-27": act(1), "2026-09-28": act(2), "2026-09-29": act(1) };
    expect(currentStreak(activity, "2026-09-29")).toBe(3);
    expect(currentStreak(activity, "2026-09-30")).toBe(3); // haven't studied yet today
    expect(currentStreak(activity, "2026-10-01")).toBe(0); // missed a day
  });
  it("finds the longest run", () => {
    const activity = { "2026-09-01": act(1), "2026-09-02": act(1), "2026-09-10": act(1), "2026-09-11": act(1), "2026-09-12": act(1) };
    expect(longestStreak(activity)).toBe(3);
  });
});

describe("migrate", () => {
  it("fills in missing fields from an older/partial save", () => {
    const data = migrate({ version: 1, lessons: { "python/a/b": { exercises: {}, quiz: {} } }, settings: { theme: "warm" } });
    expect(data.settings.theme).toBe("warm");
    expect(data.settings.timeoutSec).toBe(5);
    expect(data.review).toEqual({});
    expect(Object.keys(data.lessons)).toEqual(["python/a/b"]);
  });
  it("rejects files that are not progress files", () => {
    expect(() => migrate({ hello: "world" })).toThrow();
    expect(migrate(undefined)).toEqual({ ...emptyProgress(), createdAt: expect.any(String) });
  });
});
