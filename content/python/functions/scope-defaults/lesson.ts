import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Use default and keyword arguments, understand local scope, and document functions with docstrings.",
  example: {
    intro: "One flexible price function, then a small scope experiment.",
    code: `def price(nights, rate=450, breakfast=False):
    """Return the price of a stay in MXN."""
    total = nights * rate
    if breakfast:
        total = total + nights * 95
    return total

a = price(2)
b = price(2, 600)
c = price(2, breakfast=True)
print(a, b, c)

discount = 0.1
def apply_discount(amount):
    discount = 0.2
    return amount * (1 - discount)

print(apply_discount(1000), discount)
`,
  },
  tryIt: { prompt: "Add `print(price.__doc__)` at the end. Then call `price(rate=500, nights=3)`. Does the order of keyword arguments matter?" },
  exercises: [
    {
      id: "convert",
      title: "A converter with a default rate",
      prompt:
        "Write `convert(amount, mxn_per_eur=21.5)` that returns the amount in euros, rounded to 2 decimals. Give it a **docstring**.",
      starter: `def convert(amount, mxn_per_eur=21.5):
    pass
`,
      tests: [
        { kind: "call", call: "convert(215)", expect: 10.0, hint: "Without a second argument, the default 21.5 is used." },
        { kind: "call", call: "convert(1000, 20)", expect: 50.0 },
        { kind: "call", call: "convert(1000, mxn_per_eur=25)", expect: 40.0 },
        { kind: "call", call: "convert(100)", expect: 4.65, hint: "Round to 2 decimals." },
        { kind: "py", label: "Has a docstring", check: `f = ns.get("convert")
if not f or not (f.__doc__ or "").strip():
    fail('Add a docstring: a string on the first line of the body, e.g. """Convert MXN to EUR."""')` },
      ],
      hints: [
        "The default is already in the `def` line. Inside, divide by `mxn_per_eur`.",
        'A docstring is a triple-quoted string as the first line of the body: `"""Convert pesos to euros."""`',
        '```python\ndef convert(amount, mxn_per_eur=21.5):\n    """Convert an amount in MXN to EUR, rounded to cents."""\n    return round(amount / mxn_per_eur, 2)\n```',
      ],
      solution: {
        code: `def convert(amount, mxn_per_eur=21.5):
    """Convert an amount in MXN to EUR, rounded to cents."""
    return round(amount / mxn_per_eur, 2)
`,
        explanation: "`convert(215)` uses the default: 215 / 21.5 → 10.0. `convert(1000, 20)` overrides it positionally, and `mxn_per_eur=25` by keyword. When the rate changes, you update one default instead of every call.",
      },
      wrongAnswers: [
        `def convert(amount, mxn_per_eur=21.5):\n    """Convert."""\n    return round(amount * mxn_per_eur, 2)\n`,
        `def convert(amount, mxn_per_eur=21.5):\n    return round(amount / mxn_per_eur, 2)\n`,
        `def convert(amount, mxn_per_eur=21.5):\n    """Convert."""\n    return round(amount / 21.5, 2)\n`,
      ],
    },
    {
      id: "quote",
      title: "Quote with optional guests",
      prompt:
        "Write `quote(nights, rate=450, guests=2)`. The rate covers 2 guests; each extra guest adds 150 MXN per night. Return the total.",
      starter: `def quote(nights, rate=450, guests=2):
    pass
`,
      tests: [
        { kind: "call", call: "quote(2)", expect: 900 },
        { kind: "call", call: "quote(2, 600)", expect: 1200 },
        { kind: "call", call: "quote(3, guests=4)", expect: 2250, hint: "2 extra guests × 150 = 300 extra per night: 3 × (450 + 300)." },
        { kind: "call", call: "quote(1, 500, 1)", expect: 500, hint: "Fewer than 2 guests doesn't give a discount: the extra is never negative." },
      ],
      hints: [
        "Work out the extra per night first: `(guests - 2) * 150`, but only when `guests > 2`.",
        "Total = `nights * (rate + extra)`.",
        "```python\ndef quote(nights, rate=450, guests=2):\n    extra = 0\n    if guests > 2:\n        extra = (guests - 2) * 150\n    return nights * (rate + extra)\n```",
      ],
      solution: {
        code: `def quote(nights, rate=450, guests=2):
    """Price of a stay; each guest above 2 adds 150 MXN per night."""
    extra = 0
    if guests > 2:
        extra = (guests - 2) * 150
    return nights * (rate + extra)
`,
        explanation: "`quote(3, guests=4)` skips `rate` (so it's 450) and names `guests`. Extra = 2 × 150 = 300, so the total is 3 × 750 = 2250. With 1 guest, `extra` stays 0.",
      },
      wrongAnswers: [
        `def quote(nights, rate=450, guests=2):\n    return nights * (rate + (guests - 2) * 150)\n`,
        `def quote(nights, rate=450, guests=2):\n    extra = 0\n    if guests > 2:\n        extra = (guests - 2) * 150\n    return nights * rate + extra\n`,
      ],
    },
    {
      id: "fix-scope",
      title: "Fix the scope bug",
      prompt:
        "This program crashes with `UnboundLocalError`. Rewrite `add_booking` so it takes **the current total and the amount** as parameters and **returns** the new total, and update the calls to `total_revenue = add_booking(total_revenue, 1350)`. It should print `1830`.",
      starter: `def add_booking(amount):
    total_revenue = total_revenue + amount

total_revenue = 0
add_booking(1350)
add_booking(480)
print(total_revenue)
`,
      tests: [
        { kind: "call", call: "add_booking(100, 50)", expect: 150, hint: "The function needs two parameters: the current total and the amount." },
        { kind: "output", label: "Prints 1830", expect: "1830", hint: "Store what the function returns: `total_revenue = add_booking(total_revenue, 1350)`." },
        { kind: "source", label: "No global", pattern: "\\bglobal\\b", negate: true, message: "Avoid `global`: pass the total in and return the new one." },
      ],
      hints: [
        "Read the error: inside the function, `total_revenue` is local, so it has no value yet.",
        "Change the definition to `def add_booking(total, amount):` and `return total + amount`.",
        "The calls become `total_revenue = add_booking(total_revenue, 1350)` and the same for 480.",
      ],
      solution: {
        code: `def add_booking(total, amount):
    return total + amount

total_revenue = 0
total_revenue = add_booking(total_revenue, 1350)
total_revenue = add_booking(total_revenue, 480)
print(total_revenue)
`,
        explanation:
          "Data goes in through parameters and comes out through `return`. Nothing is hidden: you can read the main code and see exactly how `total_revenue` changes: 0 → 1350 → 1830. That's what makes functions easy to test.",
      },
      wrongAnswers: [
        `def add_booking(total, amount):\n    return total + amount\n\ntotal_revenue = 0\nadd_booking(total_revenue, 1350)\nadd_booking(total_revenue, 480)\nprint(total_revenue)\n`,
        `def add_booking(amount):\n    global total_revenue\n    total_revenue = total_revenue + amount\n\ntotal_revenue = 0\nadd_booking(1350)\nadd_booking(480)\nprint(total_revenue)\n`,
      ],
    },
  ],
  quiz: [
    {
      id: "defaults",
      kind: "predict",
      question: "What does this print?",
      code: `def fee(nights, per_night=50):
    return nights * per_night

print(fee(3), fee(3, 20), fee(per_night=10, nights=2))
`,
      options: ["150 60 20", "150 60 10", "150 150 20", "150 20 20"],
      answer: 0,
      explanation: "fee(3) uses the default 50 → 150. fee(3, 20) → 60. With keywords the order doesn't matter: 2 × 10 → 20.",
    },
    {
      id: "local",
      kind: "predict",
      question: "What does this print?",
      code: `rate = 400
def season():
    rate = 700
    return rate

print(season(), rate)
`,
      options: ["700 700", "700 400", "400 400", "400 700"],
      answer: 1,
      explanation: "The `rate = 700` inside the function is a separate local variable. The outer `rate` stays 400.",
    },
    {
      id: "local-invisible",
      kind: "predict",
      question: "What happens?",
      code: `def calc():
    subtotal = 900
    return subtotal * 2

calc()
print(subtotal)
`,
      options: ["900", "1800", "NameError", "None"],
      answer: 2,
      explanation: "`subtotal` only exists inside `calc` while it runs. Outside it's unknown → `NameError`. Use the returned value instead: `result = calc()`.",
    },
  ],
});
