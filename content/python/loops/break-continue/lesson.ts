import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Skip items with `continue` and stop a loop early with `break`.",
  example: {
    intro: "How many nights does it take to earn 3000 MXN at 450 per night, if the motel closes every 7th night for deep cleaning?",
    code: `target = 3000
total = 0
for night in range(1, 31):
    if night % 7 == 0:
        print(f"Night {night}: closed for cleaning")
        continue
    total = total + 450
    if total >= target:
        break
print(f"Target reached on night {night} with {total} MXN")
`,
  },
  tryIt: { prompt: "Change the target to 6000. Predict which night it's reached, and how many cleaning nights you'll pass. Then remove the `break`: what changes?" },
  exercises: [
    {
      id: "skip-maintenance",
      title: "Skip rooms under maintenance",
      prompt: "Print rooms **101 to 110**, one per line, but skip **104** and **107** (under maintenance) using `continue`.",
      starter: `for room in range(101, 111):
    # skip 104 and 107
    print(room)
`,
      tests: [
        { kind: "output", label: "Prints all rooms except 104 and 107", expect: "101\n102\n103\n105\n106\n108\n109\n110" },
        { kind: "source", label: "Uses continue", pattern: "\\bcontinue\\b", message: "Skip the rooms with `continue`." },
      ],
      hints: [
        "Check the room number at the top of the loop, before the print.",
        "`if room == 104 or room == 107:` followed by `continue`.",
        "```python\nfor room in range(101, 111):\n    if room == 104 or room == 107:\n        continue\n    print(room)\n```",
      ],
      solution: {
        code: `for room in range(101, 111):
    if room == 104 or room == 107:
        continue
    print(room)
`,
        explanation: "For 104 and 107 the `continue` jumps back to the `for` line before the print runs. All other rooms reach the print.",
      },
      wrongAnswers: [
        `for room in range(101, 111):\n    if room == 104 or room == 107:\n        break\n    print(room)\n`,
        `for room in range(101, 111):\n    print(room)\n    if room == 104 or room == 107:\n        continue\n`,
      ],
    },
    {
      id: "over-budget",
      title: "When does the budget run out?",
      prompt:
        "A renovation costs `300 + 50 * day` MXN on each day (day 1 costs 350, day 2 costs 400, …). The budget is **2000 MXN**. Loop over days 1–30, keep a running `spent` total, and **stop** at the first day the total goes **over** 2000. Then print:\n\n```text\nBudget exceeded on day 5 (2250 MXN)\n```",
      starter: `budget = 2000
spent = 0
# loop over the days, stop when spent > budget
`,
      tests: [
        { kind: "var", variable: "day", expect: 5, hint: "Stop with `break` as soon as `spent > budget`." },
        { kind: "var", variable: "spent", expect: 2250 },
        { kind: "output", label: "Prints the result", expect: "Budget exceeded on day 5 (2250 MXN)" },
        { kind: "source", label: "Uses break", pattern: "\\bbreak\\b", message: "Stop the loop with `break`." },
      ],
      hints: [
        "Use `for day in range(1, 31):` and add the day's cost to `spent`.",
        "Right after adding, check `if spent > budget:` and `break`.",
        '```python\nfor day in range(1, 31):\n    spent = spent + 300 + 50 * day\n    if spent > budget:\n        break\nprint(f"Budget exceeded on day {day} ({spent} MXN)")\n```',
      ],
      solution: {
        code: `budget = 2000
spent = 0
for day in range(1, 31):
    spent = spent + 300 + 50 * day
    if spent > budget:
        break
print(f"Budget exceeded on day {day} ({spent} MXN)")
`,
        explanation:
          "Running total: day 1 → 350, day 2 → 750, day 3 → 1200, day 4 → 1700, day 5 → 2250. `2250 > 2000` is True, so `break` stops the loop and `day` stays 5. Without `break`, the loop would run all 30 days.",
      },
      wrongAnswers: [
        `budget = 2000\nspent = 0\nfor day in range(1, 31):\n    spent = spent + 300 + 50 * day\nprint(f"Budget exceeded on day {day} ({spent} MXN)")\n`,
        `budget = 2000\nspent = 0\nfor day in range(1, 31):\n    if spent > budget:\n        break\n    spent = spent + 300 + 50 * day\nprint(f"Budget exceeded on day {day} ({spent} MXN)")\n`,
      ],
    },
    {
      id: "pin",
      title: "Three PIN attempts",
      prompt:
        "The safe's PIN is `4321`. Give the user **3 attempts**: ask `PIN: `. If it's right, stop asking and print `Access granted`. If it's wrong, print `Wrong PIN`. After 3 wrong attempts print `Card blocked`.",
      starter: `pin = "4321"
granted = False
# up to 3 attempts
`,
      tests: [
        { kind: "output", label: "Right on the second try", stdin: ["1111", "4321"], expect: "PIN: 1111\nWrong PIN\nPIN: 4321\nAccess granted", hint: "After the right PIN, `break` so you don't ask again." },
        { kind: "output", label: "Three wrong attempts", stdin: ["1", "2", "3"], expect: "PIN: 1\nWrong PIN\nPIN: 2\nWrong PIN\nPIN: 3\nWrong PIN\nCard blocked" },
        { kind: "output", label: "Right immediately", stdin: ["4321"], expect: "PIN: 4321\nAccess granted" },
      ],
      hints: [
        "`for attempt in range(3):` asks at most 3 times. Compare the answer as text: `guess == pin`.",
        "When it's right: set `granted = True` and `break`. After the loop, use `granted` to decide what to print.",
        '```python\nfor attempt in range(3):\n    guess = input("PIN: ")\n    if guess == pin:\n        granted = True\n        break\n    print("Wrong PIN")\nif granted:\n    print("Access granted")\nelse:\n    print("Card blocked")\n```',
      ],
      solution: {
        code: `pin = "4321"
granted = False
for attempt in range(3):
    guess = input("PIN: ")
    if guess == pin:
        granted = True
        break
    print("Wrong PIN")
if granted:
    print("Access granted")
else:
    print("Card blocked")
`,
        explanation:
          "The loop ends in one of two ways: `break` (right PIN) or running out of attempts. The `granted` variable (a \"flag\") remembers which one happened, so the code after the loop can react.",
      },
      wrongAnswers: [
        `pin = "4321"\ngranted = False\nfor attempt in range(3):\n    guess = input("PIN: ")\n    if guess == pin:\n        granted = True\n    else:\n        print("Wrong PIN")\nif granted:\n    print("Access granted")\nelse:\n    print("Card blocked")\n`,
        `pin = "4321"\ngranted = False\nfor attempt in range(3):\n    guess = int(input("PIN: "))\n    if guess == pin:\n        granted = True\n        break\n    print("Wrong PIN")\nif granted:\n    print("Access granted")\nelse:\n    print("Card blocked")\n`,
      ],
    },
  ],
  quiz: [
    {
      id: "predict-continue",
      kind: "predict",
      question: "What does this print?",
      code: `for i in range(5):
    if i == 2:
        continue
    print(i)
`,
      options: ["0\n1", "0\n1\n3\n4", "0\n1\n2\n3\n4", "2"],
      answer: 1,
      explanation: "When `i` is 2, `continue` skips the print. All other values are printed.",
    },
    {
      id: "predict-break",
      kind: "predict",
      question: "What does this print?",
      code: `for i in range(10):
    if i * i > 10:
        break
print(i)
`,
      options: ["3", "4", "9", "10"],
      answer: 1,
      explanation: "3 × 3 = 9 is not > 10, but 4 × 4 = 16 is, so the loop breaks with `i` = 4.",
    },
    {
      id: "break-vs-continue",
      kind: "choice",
      question: "What's the difference between `break` and `continue`?",
      options: [
        "They do the same thing",
        "`break` ends the whole loop; `continue` only skips the rest of the current round",
        "`continue` ends the loop; `break` skips one round",
        "`break` restarts the loop from the beginning",
      ],
      answer: 1,
      explanation: "`break` = stop the loop now. `continue` = skip to the next round.",
    },
  ],
});
