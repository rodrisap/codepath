import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Use `+ - * / // % **` and predict the order in which Python calculates an expression.",
  example: {
    intro: "A guest stays 17 nights. Full weeks get the weekly rate, extra nights the nightly rate.",
    code: `nights = 17
week_rate = 2800
night_rate = 450
weeks = nights // 7
extra_nights = nights % 7
cost = weeks * week_rate + extra_nights * night_rate
print("Weeks:", weeks, "| extra nights:", extra_nights)
print("Cost:", cost)
avg = cost / nights
print("Average per night:", avg)
without_brackets = 100 + 50 * 2
with_brackets = (100 + 50) * 2
print(without_brackets, with_brackets)
`,
  },
  tryIt: {
    prompt: "Change `nights` to 21, then to 6. Predict `weeks`, `extra_nights` and `cost` before running. Then check your prediction with **Trace**.",
  },
  exercises: [
    {
      id: "weeks-days",
      title: "Weeks and days",
      prompt:
        "Split `days` into full weeks and leftover days using `//` and `%`. Store them in `weeks` and `rest`, then print:\n\n```text\n23 days = 3 weeks and 2 days\n```",
      starter: `days = 23
# create weeks and rest, then print the sentence
`,
      tests: [
        { kind: "var", variable: "weeks", expect: 3, hint: "Whole-number division: `days // 7`." },
        { kind: "var", variable: "rest", expect: 2, hint: "The remainder: `days % 7`." },
        { kind: "output", label: "Prints the sentence", expect: "23 days = 3 weeks and 2 days" },
        {
          kind: "source",
          label: "Uses // and %",
          pattern: "days\\s*//\\s*7[\\s\\S]*days\\s*%\\s*7|days\\s*%\\s*7[\\s\\S]*days\\s*//\\s*7",
          message: "Calculate from `days` with `days // 7` and `days % 7`, so it works for any number of days.",
        },
      ],
      hints: [
        "`//` gives the whole part of a division, `%` gives what's left over.",
        "`weeks = days // 7` and `rest = days % 7`.",
        'Print with an f-string: `print(f"{days} days = {weeks} weeks and {rest} days")`.',
      ],
      solution: {
        code: `days = 23
weeks = days // 7
rest = days % 7
print(f"{days} days = {weeks} weeks and {rest} days")
`,
        explanation: "`23 // 7` → `3` (3 × 7 = 21 fits), `23 % 7` → `2` (23 − 21 is left over). This pair is useful any time you split something into full units and a remainder: weeks, boxes, pages, etc.",
      },
      wrongAnswers: [
        `days = 23\nweeks = days / 7\nrest = days % 7\nprint(f"{days} days = {weeks} weeks and {rest} days")\n`,
        `days = 23\nweeks = 3\nrest = 2\nprint(f"{days} days = {weeks} weeks and {rest} days")\n`,
      ],
    },
    {
      id: "fix-order",
      title: "Fix the operator order",
      prompt:
        "A booking costs 3 nights × 450 MXN **plus** a 200 MXN cleaning fee, and the guest gets **10% off the whole amount** (× 0.9). The code gives the wrong total. Fix it with brackets so `total` is **1395.0**.",
      starter: `total = 3 * 450 + 200 * 0.9
print("Total:", total)
`,
      tests: [
        { kind: "var", variable: "total", expect: 1395.0, hint: "The discount must apply to the nights AND the fee together: put them in brackets." },
        { kind: "output", label: "Prints the total", expect: "Total: 1395.0" },
      ],
      hints: [
        "Use Trace on the starter code: which multiplication happens first?",
        "Right now only the fee gets the 10% discount. The whole sum should be discounted.",
        "`total = (3 * 450 + 200) * 0.9`",
      ],
      solution: {
        code: `total = (3 * 450 + 200) * 0.9
print("Total:", total)
`,
        explanation:
          "Without brackets Python does `3 * 450` → 1350 and `200 * 0.9` → 180.0, then adds: 1530.0. With brackets it first builds the full amount `1350 + 200` → 1550, then applies the discount: `1550 * 0.9` → 1395.0.",
      },
      wrongAnswers: [`total = 3 * 450 + 200 * 0.9\nprint("Total:", total)\n`, `total = 3 * (450 + 200) * 0.9\nprint("Total:", total)\n`],
    },
    {
      id: "occupancy",
      title: "Occupancy rate",
      prompt:
        "Occupancy rate = occupied rooms ÷ total rooms × 100. Calculate `occupancy` for tonight and print it with one decimal:\n\n```text\nOccupancy: 75.0%\n```",
      starter: `occupied = 9
total_rooms = 12
# calculate occupancy (a percentage) and print it
`,
      tests: [
        { kind: "var", variable: "occupancy", expect: 75.0, hint: "Divide occupied by total_rooms, then multiply by 100." },
        { kind: "output", label: "Prints the rate", expect: "Occupancy: 75.0%", hint: 'Use an f-string with `:.1f` followed by a literal `%`: `f"Occupancy: {occupancy:.1f}%"`.' },
      ],
      hints: [
        "9 of 12 rooms is 0.75 of the motel. As a percentage that's 75.",
        "`occupancy = occupied / total_rooms * 100`. `/` and `*` have the same level, so they run left to right.",
        '`print(f"Occupancy: {occupancy:.1f}%")`',
      ],
      solution: {
        code: `occupied = 9
total_rooms = 12
occupancy = occupied / total_rooms * 100
print(f"Occupancy: {occupancy:.1f}%")
`,
        explanation: "Left to right: `9 / 12` → `0.75`, then `0.75 * 100` → `75.0`. Occupancy is one of the key numbers in hospitality: together with the average rate it drives revenue.",
      },
      wrongAnswers: [
        `occupied = 9\ntotal_rooms = 12\noccupancy = occupied / (total_rooms * 100)\nprint(f"Occupancy: {occupancy:.1f}%")\n`,
        `occupied = 9\ntotal_rooms = 12\noccupancy = total_rooms / occupied * 100\nprint(f"Occupancy: {occupancy:.1f}%")\n`,
      ],
    },
  ],
  quiz: [
    {
      id: "div-trio",
      kind: "predict",
      question: "What does this print?",
      code: `print(7 / 2, 7 // 2, 7 % 2)`,
      options: ["3.5 3 1", "3.5 3.5 1", "3 3 1", "3.5 4 1"],
      answer: 0,
      explanation: "`/` always gives a float (3.5), `//` keeps the whole part (3), `%` gives the remainder (7 − 6 = 1).",
    },
    {
      id: "precedence",
      kind: "predict",
      question: "What does this print?",
      code: `print(2 + 3 * 4 ** 2)`,
      options: ["400", "50", "196", "80"],
      answer: 1,
      explanation: "Power first: `4 ** 2` → 16. Then multiply: `3 * 16` → 48. Then add: `2 + 48` → 50.",
    },
    {
      id: "slash-float",
      kind: "predict",
      question: "What does this print?",
      code: `print(10 / 5)`,
      options: ["2", "2.0", "0.5", "2.5"],
      answer: 1,
      explanation: "`/` always returns a float, even when the division is exact. Use `10 // 5` if you want the int `2`.",
    },
  ],
});
