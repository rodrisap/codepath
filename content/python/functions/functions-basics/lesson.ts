import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Define functions with parameters and `return`, call them with different arguments, and know the difference between `return` and `print`.",
  example: {
    intro: "One function, used for two guests. Step through it and watch the program jump into the function and back.",
    code: `def booking_total(nights, rate):
    subtotal = nights * rate
    return subtotal * 1.16

ana = booking_total(3, 450)
luis = booking_total(2, 500)
print(f"Ana: {ana:.2f} MXN")
print(f"Luis: {luis:.2f} MXN")
print(f"Together: {ana + luis:.2f} MXN")
`,
  },
  tryIt: { prompt: "Change `return subtotal * 1.16` into `print(subtotal * 1.16)` and run it. What happens on the last line, and why? Put it back afterwards." },
  exercises: [
    {
      id: "booking-total",
      title: "A reusable price function",
      prompt: "Write a function `booking_total(nights, rate)` that **returns** the price of a stay (nights × rate). Don't print inside the function.",
      starter: `def booking_total(nights, rate):
    # return the price
    pass
`,
      tests: [
        { kind: "call", call: "booking_total(3, 50)", expect: 150, hint: "Check if you multiplied by nights." },
        { kind: "call", call: "booking_total(1, 450)", expect: 450 },
        { kind: "call", call: "booking_total(0, 450)", expect: 0 },
        { kind: "call", call: "booking_total(4, 612.5)", expect: 2450 },
      ],
      hints: [
        "Replace `pass` with a `return` line.",
        "The price is `nights * rate`.",
        "```python\ndef booking_total(nights, rate):\n    return nights * rate\n```",
      ],
      solution: {
        code: `def booking_total(nights, rate):
    return nights * rate
`,
        explanation: "For the call `booking_total(3, 50)`: inside the function `nights = 3` and `rate = 50`, so `return 3 * 50` → 150 goes back to the caller. The tests call it with four different sets of arguments; one definition handles them all.",
      },
      wrongAnswers: [
        `def booking_total(nights, rate):\n    return nights + rate\n`,
        `def booking_total(nights, rate):\n    print(nights * rate)\n`,
        `def booking_total(nights, rate):\n    return rate\n`,
      ],
    },
    {
      id: "with-vat",
      title: "Add VAT, rounded",
      prompt: "Write `with_vat(amount)` that returns the amount **plus 16% VAT**, rounded to 2 decimals.",
      starter: `def with_vat(amount):
    pass
`,
      tests: [
        { kind: "call", call: "with_vat(1000)", expect: 1160.0 },
        { kind: "call", call: "with_vat(603)", expect: 699.48, hint: "Round the result with `round(..., 2)`." },
        { kind: "call", call: "with_vat(10.01)", expect: 11.61, hint: "10.01 × 1.16 = 11.6116, which must be rounded to 2 decimals." },
        { kind: "call", call: "with_vat(0)", expect: 0 },
        { kind: "call", call: "with_vat(with_vat(100))", expect: 134.56, hint: "A function's result can be passed into another call." },
      ],
      hints: [
        "Adding 16% means multiplying by 1.16.",
        "Wrap the calculation in `round(..., 2)`.",
        "```python\ndef with_vat(amount):\n    return round(amount * 1.16, 2)\n```",
      ],
      solution: {
        code: `def with_vat(amount):
    return round(amount * 1.16, 2)
`,
        explanation: "`603 * 1.16` is `699.4799999999999` in floating point; `round(…, 2)` → 699.48. In `with_vat(with_vat(100))` the inner call runs first (→ 116.0), then its result becomes the argument of the outer call (→ 134.56).",
      },
      wrongAnswers: [`def with_vat(amount):\n    return amount * 1.16\n`, `def with_vat(amount):\n    return round(amount * 0.16, 2)\n`],
    },
    {
      id: "occupancy",
      title: "Occupancy, safely",
      prompt:
        "Write `occupancy_rate(occupied, total_rooms)` that returns the occupancy as a percentage, rounded to 1 decimal. If `total_rooms` is 0, return `0.0` instead of crashing.",
      starter: `def occupancy_rate(occupied, total_rooms):
    pass
`,
      tests: [
        { kind: "call", call: "occupancy_rate(9, 12)", expect: 75.0 },
        { kind: "call", call: "occupancy_rate(1, 3)", expect: 33.3 },
        { kind: "call", call: "occupancy_rate(0, 12)", expect: 0.0 },
        { kind: "call", call: "occupancy_rate(5, 0)", expect: 0.0, hint: "Check `total_rooms == 0` first and return 0.0 before dividing." },
      ],
      hints: [
        "Guard first: `if total_rooms == 0: return 0.0`.",
        "Otherwise: `occupied / total_rooms * 100`, rounded to 1 decimal.",
        "```python\ndef occupancy_rate(occupied, total_rooms):\n    if total_rooms == 0:\n        return 0.0\n    return round(occupied / total_rooms * 100, 1)\n```",
      ],
      solution: {
        code: `def occupancy_rate(occupied, total_rooms):
    if total_rooms == 0:
        return 0.0
    return round(occupied / total_rooms * 100, 1)
`,
        explanation: "The early `return 0.0` ends the function before the division, so `ZeroDivisionError` can't happen. `1 / 3 * 100` → 33.333…, rounded → 33.3.",
      },
      wrongAnswers: [
        `def occupancy_rate(occupied, total_rooms):\n    return round(occupied / total_rooms * 100, 1)\n`,
        `def occupancy_rate(occupied, total_rooms):\n    if total_rooms == 0:\n        return 0.0\n    return occupied / total_rooms * 100\n`,
      ],
    },
  ],
  quiz: [
    {
      id: "print-not-return",
      kind: "predict",
      question: "What does this print?",
      code: `def total(n, r):
    print(n * r)

x = total(2, 100)
print(x)
`,
      options: ["200\n200", "200\nNone", "None", "200"],
      answer: 1,
      explanation: "The function *prints* 200, but has no `return`, so it gives back `None`, which is stored in `x`.",
    },
    {
      id: "return-ends",
      kind: "predict",
      question: "What does this print?",
      code: `def f(x):
    return x * 2
    print("done")

print(f(5) + 1)
`,
      options: ["10", "11", "done\n11", "11\ndone"],
      answer: 1,
      explanation: "`return` ends the function immediately, so `print(\"done\")` never runs. `f(5)` → 10, plus 1 → 11.",
    },
    {
      id: "def-not-called",
      kind: "predict",
      question: "What does this print?",
      code: `def greet():
    print("Welcome!")

print("Start")
`,
      options: ["Welcome!\nStart", "Start", "Start\nWelcome!", "Nothing"],
      answer: 1,
      explanation: "`def` only *defines* the function. Its body runs when the function is called, and `greet()` is never called here.",
    },
  ],
});
