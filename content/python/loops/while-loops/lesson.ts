import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Repeat work with `while` until a condition changes, and make sure the loop always ends.",
  example: {
    intro: "The motel wants 1500 MXN for a new mattress. Starting with 1000 MXN that grows 10% per month: how many months until the target is reached?",
    code: `balance = 1000
month = 0
while balance < 1500:
    balance = balance * 1.1
    month = month + 1
    print(f"Month {month}: {balance:.2f}")
print(f"Target reached after {month} months")
`,
  },
  tryIt: { prompt: "Change the target to 2000 and predict the number of months. Then remove line 5 (`month = month + 1`). Does the loop still end? Why?" },
  exercises: [
    {
      id: "rooms-left",
      title: "Selling out",
      prompt:
        "There are 3 free rooms. With a `while` loop, sell them one at a time, printing how many are left after each sale, and finish with `Fully booked`:\n\n```text\nSold one, 2 left\nSold one, 1 left\nSold one, 0 left\nFully booked\n```",
      starter: `rooms = 3
# while there are rooms left...
`,
      tests: [
        { kind: "output", label: "Sells all 3 rooms", expect: "Sold one, 2 left\nSold one, 1 left\nSold one, 0 left\nFully booked", hint: "Decrease `rooms` *before* printing how many are left." },
        { kind: "source", label: "Uses a while loop", pattern: "\\bwhile\\b", message: "Use `while rooms > 0:`." },
      ],
      hints: [
        "Keep going while `rooms > 0`.",
        "Inside the loop: `rooms = rooms - 1`, then print. After the loop (not indented): print `Fully booked`.",
        '```python\nwhile rooms > 0:\n    rooms = rooms - 1\n    print(f"Sold one, {rooms} left")\nprint("Fully booked")\n```',
      ],
      solution: {
        code: `rooms = 3
while rooms > 0:
    rooms = rooms - 1
    print(f"Sold one, {rooms} left")
print("Fully booked")
`,
        explanation: "Checks: `3 > 0` True → 2 left; `2 > 0` True → 1 left; `1 > 0` True → 0 left; `0 > 0` False → loop ends. `rooms - 1` is what guarantees the end.",
      },
      wrongAnswers: [
        `rooms = 3\nwhile rooms >= 0:\n    rooms = rooms - 1\n    print(f"Sold one, {rooms} left")\nprint("Fully booked")\n`,
        `rooms = 3\nwhile rooms > 0:\n    print(f"Sold one, {rooms} left")\n    rooms = rooms - 1\nprint("Fully booked")\n`,
      ],
    },
    {
      id: "valid-nights",
      title: "Ask until the answer is valid",
      prompt:
        "Ask `Nights (1-30): `. While the answer is **below 1 or above 30**, print `Please enter 1 to 30.` and ask again. At the end print `OK: 3 nights` (with the valid number).",
      starter: `nights = int(input("Nights (1-30): "))
# keep asking while the value is invalid
`,
      tests: [
        {
          kind: "output",
          label: "Rejects 0 and 45, accepts 3",
          stdin: ["0", "45", "3"],
          expect: "Nights (1-30): 0\nPlease enter 1 to 30.\nNights (1-30): 45\nPlease enter 1 to 30.\nNights (1-30): 3\nOK: 3 nights",
          hint: "Ask again *inside* the loop, so the condition is checked on the new answer.",
        },
        { kind: "output", label: "Valid on the first try", stdin: ["30"], expect: "Nights (1-30): 30\nOK: 30 nights" },
      ],
      hints: [
        "Invalid means `nights < 1 or nights > 30`. That's your while condition.",
        "Inside the loop: print the message, then ask again and store the answer in `nights`.",
        '```python\nwhile nights < 1 or nights > 30:\n    print("Please enter 1 to 30.")\n    nights = int(input("Nights (1-30): "))\nprint(f"OK: {nights} nights")\n```',
      ],
      solution: {
        code: `nights = int(input("Nights (1-30): "))
while nights < 1 or nights > 30:
    print("Please enter 1 to 30.")
    nights = int(input("Nights (1-30): "))
print(f"OK: {nights} nights")
`,
        explanation: "0 → invalid, ask again → 45 → invalid, ask again → 3 → `3 < 1 or 3 > 30` is False, so the loop ends. If the first answer is valid, the loop body never runs.",
      },
      wrongAnswers: [
        `nights = int(input("Nights (1-30): "))\nif nights < 1 or nights > 30:\n    print("Please enter 1 to 30.")\n    nights = int(input("Nights (1-30): "))\nprint(f"OK: {nights} nights")\n`,
        `nights = int(input("Nights (1-30): "))\nwhile nights < 1 and nights > 30:\n    print("Please enter 1 to 30.")\n    nights = int(input("Nights (1-30): "))\nprint(f"OK: {nights} nights")\n`,
      ],
    },
    {
      id: "loan",
      title: "Paying off a loan",
      prompt:
        "The motel borrowed **5000 MXN** for new air conditioning. Each month **2% interest** is added and then **800 MXN** is paid. Count the months until the balance is 0 or less, and print `Paid off after 7 months`.",
      starter: `balance = 5000
months = 0
# each month: add 2% interest, then pay 800
`,
      tests: [
        { kind: "var", variable: "months", expect: 7, hint: "Order each month: balance × 1.02, then − 800. Keep going while balance > 0." },
        { kind: "output", label: "Prints the months", expect: "Paid off after 7 months" },
        { kind: "var", label: "Interest is added every month", variable: "balance", expect: -203.99836772479955, hint: "Each month: first `balance * 1.02` (interest), then `- 800`." },
        { kind: "source", label: "Uses a while loop", pattern: "\\bwhile\\b", message: "You don't know the number of months in advance: use `while`." },
      ],
      hints: [
        "Keep looping while there is still something to pay: `balance > 0`.",
        "Inside: `balance = balance * 1.02 - 800` and `months = months + 1`.",
        '```python\nwhile balance > 0:\n    balance = balance * 1.02 - 800\n    months = months + 1\nprint(f"Paid off after {months} months")\n```',
      ],
      solution: {
        code: `balance = 5000
months = 0
while balance > 0:
    balance = balance * 1.02 - 800
    months = months + 1
print(f"Paid off after {months} months")
`,
        explanation:
          "Month by month: 4300.0 → 3586.0 → 2857.72 → 2114.87 → 1357.17 → 584.32 → −204.00 (rounded here for reading). After month 7 the balance is below 0, so `balance > 0` is False and the loop ends. Trace it to see every value.",
      },
      wrongAnswers: [
        `balance = 5000\nmonths = 0\nwhile balance > 0:\n    balance = balance - 800\n    months = months + 1\nprint(f"Paid off after {months} months")\n`,
        `balance = 5000\nmonths = 0\nwhile balance > 800:\n    balance = balance * 1.02 - 800\n    months = months + 1\nprint(f"Paid off after {months} months")\n`,
      ],
    },
  ],
  quiz: [
    {
      id: "doubling",
      kind: "predict",
      question: "What does this print?",
      code: `x = 1
while x < 10:
    x = x * 2
print(x)
`,
      options: ["8", "10", "16", "1\n2\n4\n8"],
      answer: 2,
      explanation: "x: 1 → 2 → 4 → 8 → 16. When x is 8, `8 < 10` is still True, so one more round makes it 16. Then `16 < 10` is False.",
    },
    {
      id: "endless",
      kind: "bug",
      question: "This never stops. Why?",
      code: `count = 0
while count < 3:
    print("Checking room", count)
`,
      options: ["`while` needs a colon", "`count` never changes, so `count < 3` stays True", "3 should be 3.0", "print can't be inside a loop"],
      answer: 1,
      explanation: "Add `count = count + 1` inside the loop. Every loop must move towards making its condition False.",
    },
    {
      id: "for-or-while",
      kind: "choice",
      question: "Which task fits a `while` loop best?",
      options: [
        "Print the 12 months of the year",
        "Add up the nights of every booking in a list",
        "Keep asking for a PIN until it's correct",
        "Print rooms 101 to 110",
      ],
      answer: 2,
      explanation: "You can't know how many attempts it will take, so repeat *while* the answer is wrong. The others have a known number of rounds: a job for `for`.",
    },
  ],
});
