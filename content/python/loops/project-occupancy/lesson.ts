import { defineLesson } from "../../../../src/content/types";

const WEEK_A = ["8", "10", "12", "6", "9", "11", "7"];
const WEEK_B = ["5", "9", "9", "3", "2", "1", "0"];

const LOOP = `rooms = 12
for day in range(1, 8):
    occupied = int(input(f"Day {day} occupied rooms: "))
    rate = occupied / rooms * 100
    print(f"Day {day}: {rate:.1f}%")
`;

const FULL = `rooms = 12
total_occupied = 0
best_day = 0
best_occupied = -1
for day in range(1, 8):
    occupied = int(input(f"Day {day} occupied rooms: "))
    rate = occupied / rooms * 100
    print(f"Day {day}: {rate:.1f}%")
    total_occupied = total_occupied + occupied
    if occupied > best_occupied:
        best_occupied = occupied
        best_day = day
average = total_occupied / (7 * rooms) * 100
print(f"Week average: {average:.1f}%")
print(f"Best day: day {best_day} ({best_occupied} rooms)")
print(f"Room revenue: {total_occupied * 450} MXN")
`;

const perDay = (week: string[]) =>
  week.map((n, i) => `Day ${i + 1} occupied rooms: ${n}\nDay ${i + 1}: ${((Number(n) / 12) * 100).toFixed(1)}%`).join("\n");

export default defineLesson({
  goal: "Combine a loop, input, conditions and accumulators into a real weekly report.",
  exercises: [
    {
      id: "daily",
      title: "Step 1: the daily rates",
      prompt: "Loop over days 1–7. Each day, ask `Day 1 occupied rooms: ` (with the right day number) and print that day's occupancy rate with 1 decimal, e.g. `Day 1: 66.7%`.",
      starter: `rooms = 12
# loop over the 7 days
`,
      tests: [
        { kind: "output", label: "Week A", stdin: WEEK_A, expect: perDay(WEEK_A), hint: "Put the day number in the prompt with an f-string: `f\"Day {day} occupied rooms: \"`." },
        { kind: "output", label: "Week B", stdin: WEEK_B, expect: perDay(WEEK_B) },
      ],
      hints: [
        "`for day in range(1, 8):` gives days 1 to 7.",
        "Inside the loop: ask with `int(input(f\"Day {day} occupied rooms: \"))`, then calculate `occupied / rooms * 100`.",
        '```python\nfor day in range(1, 8):\n    occupied = int(input(f"Day {day} occupied rooms: "))\n    rate = occupied / rooms * 100\n    print(f"Day {day}: {rate:.1f}%")\n```',
      ],
      solution: { code: LOOP, explanation: "Each round asks one question and prints one result. The prompt uses an f-string, so it shows the current day number." },
      wrongAnswers: [LOOP.replace("range(1, 8)", "range(7)"), LOOP.replace("occupied / rooms * 100", "occupied / 7 * 100")],
    },
    {
      id: "summary",
      title: "Step 2: the weekly summary",
      prompt:
        "Extend the loop with accumulators, and after the loop print the three summary lines from the brief: `Week average`, `Best day` and `Room revenue`.",
      starter: LOOP + "# after the loop: average, best day, revenue\n",
      tests: [
        {
          kind: "output",
          label: "Week A",
          stdin: WEEK_A,
          expect: perDay(WEEK_A) + "\nWeek average: 75.0%\nBest day: day 3 (12 rooms)\nRoom revenue: 28350 MXN",
          hint: "Keep a running `total_occupied`; start it at 0 before the loop.",
        },
        {
          kind: "output",
          label: "Week B (tie for best day, and a day with 0 rooms)",
          stdin: WEEK_B,
          expect: perDay(WEEK_B) + "\nWeek average: 34.5%\nBest day: day 2 (9 rooms)\nRoom revenue: 13050 MXN",
          hint: "For a tie, keep the first day: only replace the best when the new number is strictly greater (`>`).",
        },
      ],
      hints: [
        "Before the loop: `total_occupied = 0`, `best_day = 0`, `best_occupied = -1` (lower than any real value).",
        "Inside the loop: add to `total_occupied`; `if occupied > best_occupied:` remember both the number and the day.",
        "After the loop: `average = total_occupied / (7 * rooms) * 100`, and revenue is `total_occupied * 450`.",
      ],
      solution: {
        code: FULL,
        explanation:
          "Week A: the total runs 8 → 18 → 30 → 36 → 45 → 56 → 63; 63 ÷ 84 × 100 = 75.0%. The best changes on day 1 (8), day 2 (10) and day 3 (12), then never again. Starting `best_occupied` at −1 guarantees that day 1 always becomes the first \"best\", even when it's 0.",
      },
      wrongAnswers: [
        FULL.replace("if occupied > best_occupied:", "if occupied >= best_occupied:"),
        FULL.replace("average = total_occupied / (7 * rooms) * 100", "average = total_occupied / 7"),
      ],
    },
  ],
  quiz: [],
});
