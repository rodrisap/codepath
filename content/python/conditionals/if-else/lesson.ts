import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Make a program choose between two actions with `if` / `else` and comparison operators.",
  example: {
    intro: "Stays of 7 nights or more get a 10% weekly discount.",
    code: `nights = 8
rate = 450
total = nights * rate
if nights >= 7:
    discount = total * 0.10
    print("Weekly discount applied!")
else:
    discount = 0
print("Discount:", discount)
print("To pay:", total - discount)
`,
  },
  tryIt: { prompt: "Change `nights` to 7, then to 6. Predict which lines run each time, then check with **Trace**. At 6 nights, which lines are skipped?" },
  exercises: [
    {
      id: "late-checkout",
      title: "Late checkout fee",
      prompt:
        "Check-out is until 12:00. Ask `Checkout hour: ` (a whole number). If the hour is **after 12**, print `Late checkout fee: 150 MXN`, otherwise print `No fee`.",
      starter: `hour = int(input("Checkout hour: "))
# decide and print
`,
      tests: [
        { kind: "output", label: "14:00 → fee", stdin: ["14"], expect: "Checkout hour: 14\nLate checkout fee: 150 MXN" },
        { kind: "output", label: "12:00 exactly → no fee", stdin: ["12"], expect: "Checkout hour: 12\nNo fee", hint: "12 itself is still on time: use `>` not `>=`." },
        { kind: "output", label: "11:00 → no fee", stdin: ["11"], expect: "Checkout hour: 11\nNo fee" },
      ],
      hints: [
        "\"After 12\" means greater than 12.",
        "`if hour > 12:` followed by an indented print, then `else:` with its own indented print.",
        '```python\nif hour > 12:\n    print("Late checkout fee: 150 MXN")\nelse:\n    print("No fee")\n```',
      ],
      solution: {
        code: `hour = int(input("Checkout hour: "))
if hour > 12:
    print("Late checkout fee: 150 MXN")
else:
    print("No fee")
`,
        explanation: "With 14: `14 > 12 → True`, so the first print runs. With 12: `12 > 12 → False`, so the `else` runs. Testing the exact boundary value is the best way to catch a `>` vs `>=` mix-up.",
      },
      wrongAnswers: [
        `hour = int(input("Checkout hour: "))\nif hour >= 12:\n    print("Late checkout fee: 150 MXN")\nelse:\n    print("No fee")\n`,
        `hour = int(input("Checkout hour: "))\nif hour > 12:\n    print("Late checkout fee: 150 MXN")\nprint("No fee")\n`,
      ],
    },
    {
      id: "budget",
      title: "Within budget?",
      prompt:
        "Ask `Budget: ` and `Price: ` (decimals allowed). If the price fits the budget (price ≤ budget) print `Within budget`, otherwise print how much it's over, with 2 decimals, e.g. `Over budget by 120.50 MXN`.",
      starter: `budget = float(input("Budget: "))
price = float(input("Price: "))
# decide and print
`,
      tests: [
        { kind: "output", label: "Fits", stdin: ["2000", "1800"], expect: "Budget: 2000\nPrice: 1800\nWithin budget" },
        { kind: "output", label: "Exactly the budget", stdin: ["2000", "2000"], expect: "Budget: 2000\nPrice: 2000\nWithin budget", hint: "Equal to the budget still fits: use `<=`." },
        { kind: "output", label: "Too expensive", stdin: ["2000", "2120.5"], expect: "Budget: 2000\nPrice: 2120.5\nOver budget by 120.50 MXN", hint: "How much over = price − budget." },
      ],
      hints: [
        "The condition is `price <= budget`.",
        "In the `else` block, calculate `price - budget`.",
        '```python\nif price <= budget:\n    print("Within budget")\nelse:\n    print(f"Over budget by {price - budget:.2f} MXN")\n```',
      ],
      solution: {
        code: `budget = float(input("Budget: "))
price = float(input("Price: "))
if price <= budget:
    print("Within budget")
else:
    print(f"Over budget by {price - budget:.2f} MXN")
`,
        explanation: "`2120.5 <= 2000.0 → False`, so the else block calculates `2120.5 - 2000.0 → 120.5` and shows it as `120.50`.",
      },
      wrongAnswers: [
        `budget = float(input("Budget: "))\nprice = float(input("Price: "))\nif price < budget:\n    print("Within budget")\nelse:\n    print(f"Over budget by {price - budget:.2f} MXN")\n`,
        `budget = float(input("Budget: "))\nprice = float(input("Price: "))\nif price <= budget:\n    print("Within budget")\nelse:\n    print(f"Over budget by {budget - price:.2f} MXN")\n`,
      ],
    },
    {
      id: "deposit",
      title: "Deposit rule",
      prompt:
        "Bookings of **5000 MXN or more** need a **50%** deposit; smaller bookings need **30%**. Ask `Booking amount: `, store the deposit in `deposit` and print it: `Deposit: 2500.00 MXN`.",
      starter: `amount = float(input("Booking amount: "))
# deposit = ...
`,
      tests: [
        { kind: "output", label: "5000 → 50%", stdin: ["5000"], expect: "Booking amount: 5000\nDeposit: 2500.00 MXN", hint: "5000 itself counts as \"5000 or more\"." },
        { kind: "output", label: "4999 → 30%", stdin: ["4999"], expect: "Booking amount: 4999\nDeposit: 1499.70 MXN" },
        { kind: "var", label: "10000 → 50%", stdin: ["10000"], variable: "deposit", expect: 5000.0 },
      ],
      hints: [
        "Set `deposit` in both branches, then print once after the if/else.",
        "`if amount >= 5000:` → `deposit = amount * 0.5`, else `deposit = amount * 0.3`.",
        'After the if/else (not indented): `print(f"Deposit: {deposit:.2f} MXN")`.',
      ],
      solution: {
        code: `amount = float(input("Booking amount: "))
if amount >= 5000:
    deposit = amount * 0.5
else:
    deposit = amount * 0.3
print(f"Deposit: {deposit:.2f} MXN")
`,
        explanation: "Each branch only *sets* the value; the print comes after the if/else, so it's written once and runs in both cases. `4999 * 0.3 → 1499.7`.",
      },
      wrongAnswers: [
        `amount = float(input("Booking amount: "))\nif amount > 5000:\n    deposit = amount * 0.5\nelse:\n    deposit = amount * 0.3\nprint(f"Deposit: {deposit:.2f} MXN")\n`,
        `amount = float(input("Booking amount: "))\nif amount >= 5000:\n    deposit = amount * 0.3\nelse:\n    deposit = amount * 0.5\nprint(f"Deposit: {deposit:.2f} MXN")\n`,
      ],
    },
  ],
  quiz: [
    {
      id: "predict-else",
      kind: "predict",
      question: "What does this print?",
      code: `x = 5
if x > 5:
    print("A")
else:
    print("B")
print("C")
`,
      options: ["A\nC", "B\nC", "B", "A\nB\nC"],
      answer: 1,
      explanation: "`5 > 5` is False, so the else prints B. `print(\"C\")` isn't indented, so it always runs.",
    },
    {
      id: "equals-bug",
      kind: "bug",
      question: "Why does this line fail?",
      code: `if nights = 7:
    print("One week")
`,
      options: ["`nights` must be in quotes", "It must be `==` to compare, `=` is for storing", "`if` needs brackets", "7 must be 7.0"],
      answer: 1,
      explanation: "`=` assigns, `==` compares. Python stops with a SyntaxError and even suggests `==`.",
    },
    {
      id: "int-float-equal",
      kind: "predict",
      question: "What does this print?",
      code: `print(3 == 3.0, 3 != 3)`,
      options: ["True False", "False False", "True True", "False True"],
      answer: 0,
      explanation: "An int and a float with the same value are equal: `3 == 3.0` is True. `3 != 3` is False.",
    },
  ],
});
