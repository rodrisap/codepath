import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Repeat work with `for` and `range()`, and use the accumulator pattern to build a total step by step.",
  example: {
    intro: "Building up the price of a 4-night stay, one night at a time. Step through it slowly: this pattern appears everywhere.",
    code: `nights = 4
rate = 500
total = 0
for night in range(1, nights + 1):
    total = total + rate
    print(f"Night {night}: running total {total}")
print("Final total:", total)
`,
  },
  tryIt: {
    prompt: "Make the rate go up by 25 MXN every night: add `rate = rate + 25` inside the loop (after the total line). Predict the final total first, then check each round with **Trace**.",
  },
  exercises: [
    {
      id: "room-numbers",
      title: "Print the room numbers",
      prompt: "The motel's ground floor has rooms **101 to 108**. Print each room number on its own line using a `for` loop and `range`.",
      starter: `# for room in range(...):
`,
      tests: [
        { kind: "output", label: "Prints 101 to 108", expect: "101\n102\n103\n104\n105\n106\n107\n108", hint: "The end number of range is not included: to reach 108, end at 109." },
        { kind: "source", label: "Uses a for loop with range", pattern: "for\\s+\\w+\\s+in\\s+range\\(", message: "Use `for room in range(...)` instead of 8 print lines." },
      ],
      hints: [
        "`range(start, stop)` gives start, start+1, … up to but *not including* stop.",
        "You need `range(101, 109)`.",
        "```python\nfor room in range(101, 109):\n    print(room)\n```",
      ],
      solution: {
        code: `for room in range(101, 109):
    print(room)
`,
        explanation: "`range(101, 109)` produces 101, 102, …, 108: eight values, because 109 is excluded. Each round, `room` holds the next one and the indented `print` runs.",
      },
      wrongAnswers: [`for room in range(101, 108):\n    print(room)\n`, `print(101)\nprint(102)\nprint(103)\nprint(104)\nprint(105)\nprint(106)\nprint(107)\nprint(108)\n`],
    },
    {
      id: "rising-rate",
      title: "A rate that rises every night",
      prompt:
        "During a festival the rate starts at **400 MXN** and goes up by **25 MXN** each night. Calculate `total` for a **5-night** stay with a loop, and print `Total for 5 nights: 2250 MXN`.",
      starter: `nights = 5
rate = 400
total = 0
# loop over the nights
`,
      tests: [
        { kind: "var", variable: "total", expect: 2250, hint: "Night 1 costs 400, night 2 costs 425, … Add the rate first, then raise it." },
        { kind: "output", label: "Prints the total", expect: "Total for 5 nights: 2250 MXN" },
        { kind: "source", label: "Uses a loop", pattern: "\\bfor\\b|\\bwhile\\b", message: "Build the total with a loop." },
      ],
      hints: [
        "Each round does two things: add the current `rate` to `total`, then increase `rate` by 25.",
        "The order matters. Adding after raising would charge 425 on the first night.",
        '```python\nfor night in range(nights):\n    total = total + rate\n    rate = rate + 25\nprint(f"Total for {nights} nights: {total} MXN")\n```',
      ],
      solution: {
        code: `nights = 5
rate = 400
total = 0
for night in range(nights):
    total = total + rate
    rate = rate + 25
print(f"Total for {nights} nights: {total} MXN")
`,
        explanation:
          "Round by round: total 0+400 → 400 (rate → 425), 400+425 → 825 (→ 450), 825+450 → 1275 (→ 475), 1275+475 → 1750 (→ 500), 1750+500 → 2250 (→ 525). Use Trace to watch both variables change.",
      },
      wrongAnswers: [
        `nights = 5\nrate = 400\ntotal = 0\nfor night in range(nights):\n    rate = rate + 25\n    total = total + rate\nprint(f"Total for {nights} nights: {total} MXN")\n`,
        `nights = 5\nrate = 400\ntotal = 0\nfor night in range(nights):\n    total = 0\n    total = total + rate\n    rate = rate + 25\nprint(f"Total for {nights} nights: {total} MXN")\n`,
      ],
    },
    {
      id: "savings",
      title: "Savings with monthly interest",
      prompt:
        "The motel puts **10,000 MXN** in a savings account that pays **1% interest per month**. Use a loop to calculate `balance` after **12 months** (each month: balance × 1.01) and print it with 2 decimals:\n\n```text\nBalance after 12 months: 11268.25 MXN\n```",
      starter: `balance = 10000
# 12 months of 1% interest
`,
      tests: [
        { kind: "var", variable: "balance", expect: 10000 * 1.01 ** 12, hint: "Each month multiply the balance by 1.01; 12 rounds in total." },
        { kind: "output", label: "Prints the balance", expect: "Balance after 12 months: 11268.25 MXN" },
        { kind: "source", label: "Uses a loop", pattern: "\\bfor\\b|\\bwhile\\b", message: "Use a loop that runs once per month." },
      ],
      hints: [
        "`range(12)` gives exactly 12 rounds.",
        "Inside the loop: `balance = balance * 1.01`.",
        '```python\nfor month in range(12):\n    balance = balance * 1.01\nprint(f"Balance after 12 months: {balance:.2f} MXN")\n```',
      ],
      solution: {
        code: `balance = 10000
for month in range(12):
    balance = balance * 1.01
print(f"Balance after 12 months: {balance:.2f} MXN")
`,
        explanation:
          "Month 1: 10000 × 1.01 → 10100.0. Month 2: 10100.0 × 1.01 → 10201.0 (interest on the interest: that's compounding). After 12 rounds: 11268.25. Simple interest would give only 11200.",
      },
      wrongAnswers: [
        `balance = 10000\nfor month in range(12):\n    balance = balance + 10000 * 0.01\nprint(f"Balance after 12 months: {balance:.2f} MXN")\n`,
        `balance = 10000\nfor month in range(1, 12):\n    balance = balance * 1.01\nprint(f"Balance after 12 months: {balance:.2f} MXN")\n`,
      ],
    },
  ],
  quiz: [
    {
      id: "range-values",
      kind: "predict",
      question: "What does this print?",
      code: `for i in range(3):
    print(i)
`,
      options: ["1\n2\n3", "0\n1\n2", "0\n1\n2\n3", "3"],
      answer: 1,
      explanation: "`range(3)` starts at 0 and stops *before* 3: 0, 1, 2.",
    },
    {
      id: "range-step",
      kind: "predict",
      question: "What does this print?",
      code: `print(list(range(2, 10, 3)))`,
      options: ["[2, 5, 8]", "[2, 5, 8, 11]", "[3, 6, 9]", "[2, 3, 4]"],
      answer: 0,
      explanation: "Start at 2, step 3: 2, 5, 8. The next would be 11, which is past the stop value 10.",
    },
    {
      id: "accumulate",
      kind: "predict",
      question: "What does this print?",
      code: `t = 0
for n in range(1, 4):
    t = t + n
print(t)
`,
      options: ["3", "6", "10", "0\n1\n3\n6"],
      answer: 1,
      explanation: "n = 1, 2, 3 → t = 0+1 → 1, 1+2 → 3, 3+3 → 6. The print is not indented, so it runs once, after the loop.",
    },
  ],
});
