import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Calculate discounts, VAT and currency conversions, and round money correctly for display.",
  example: {
    intro: "An invoice: 3 nights at 780.50 MXN, 10% discount, then 16% IVA (Mexican VAT), also shown in euros.",
    code: `nights = 3
rate = 780.50
discount = 0.10
vat = 0.16
subtotal = nights * rate
after_discount = subtotal * (1 - discount)
vat_amount = after_discount * vat
total = after_discount + vat_amount
print("Subtotal:", subtotal)
print("VAT:", round(vat_amount, 2))
print(f"Total: {total:.2f} MXN")
eur = total / 21.5
print(f"In euros: {eur:.2f} EUR")
`,
  },
  tryIt: {
    prompt:
      "Change the discount to 15% and the VAT to 21% (the Dutch rate). Predict roughly what happens to the total first. Then try `print(0.1 + 0.2)` and `print(round(0.1 + 0.2, 2))`.",
  },
  exercises: [
    {
      id: "add-vat",
      title: "Add VAT",
      prompt: "The net price is 1250 MXN. Store the price **including 16% VAT** in `price_with_vat` and print:\n\n```text\nPrice incl. VAT: 1450.00 MXN\n```",
      starter: `net = 1250
# price_with_vat = ...
`,
      tests: [
        { kind: "var", variable: "price_with_vat", expect: 1450.0, hint: "Adding 16% means multiplying by 1.16." },
        { kind: "output", label: "Prints the price with 2 decimals", expect: "Price incl. VAT: 1450.00 MXN" },
      ],
      hints: [
        "100% of the price plus 16% on top is 116% of the price.",
        "116% as a number is 1.16.",
        '`price_with_vat = net * 1.16` and `print(f"Price incl. VAT: {price_with_vat:.2f} MXN")`.',
      ],
      solution: {
        code: `net = 1250
price_with_vat = net * 1.16
print(f"Price incl. VAT: {price_with_vat:.2f} MXN")
`,
        explanation: "`1250 * 1.16` → `1450.0`. Multiplying by 1.16 adds the 16% in one step; it's the same as `net + net * 0.16`.",
      },
      wrongAnswers: [
        `net = 1250\nprice_with_vat = net + 16\nprint(f"Price incl. VAT: {price_with_vat:.2f} MXN")\n`,
        `net = 1250\nprice_with_vat = net * 0.16\nprint(f"Price incl. VAT: {price_with_vat:.2f} MXN")\n`,
      ],
    },
    {
      id: "discount-then-vat",
      title: "Discount, then VAT",
      prompt:
        "4 nights at 900 MXN, with a **15% discount**, and then **16% VAT** on the discounted price. Store the result, **rounded to 2 decimals** with `round()`, in `total` and print:\n\n```text\nTotal: 3549.60 MXN\n```",
      starter: `nights = 4
rate = 900
# subtotal, discount, then VAT
`,
      tests: [
        { kind: "var", variable: "total", expect: 3549.6, hint: "Order: nights × rate, then × (1 − 0.15), then × 1.16." },
        { kind: "output", label: "Prints the total", expect: "Total: 3549.60 MXN" },
        { kind: "source", label: "Uses round()", pattern: "round\\(", message: "Store the final amount with `round(..., 2)`." },
      ],
      hints: [
        "Work in steps: `subtotal = nights * rate`.",
        "A 15% discount keeps 85% of the price: `* 0.85` (or `* (1 - 0.15)`). Then add VAT with `* 1.16`.",
        '`total = round(subtotal * 0.85 * 1.16, 2)` and `print(f"Total: {total:.2f} MXN")`.',
      ],
      solution: {
        code: `nights = 4
rate = 900
subtotal = nights * rate
discounted = subtotal * (1 - 0.15)
total = round(discounted * 1.16, 2)
print(f"Total: {total:.2f} MXN")
`,
        explanation:
          "`4 * 900` → 3600, `3600 * 0.85` → 3060.0, `3060.0 * 1.16` → 3549.6. `round(…, 2)` stores the money amount with at most 2 decimals, and `:.2f` shows it as `3549.60`. The order doesn't change the result here (multiplication), but invoices usually show the discount first.",
      },
      wrongAnswers: [
        `nights = 4\nrate = 900\ntotal = round(nights * rate * 0.15 * 1.16, 2)\nprint(f"Total: {total:.2f} MXN")\n`,
        `nights = 4\nrate = 900\ntotal = round(nights * rate - 0.15 + 0.16, 2)\nprint(f"Total: {total:.2f} MXN")\n`,
      ],
    },
    {
      id: "net-from-gross",
      title: "Take VAT out of a price",
      prompt:
        "A supplier's invoice says **2320 MXN including 16% VAT**. Calculate the net amount (`net`) and the VAT part (`vat_part`), both rounded to 2 decimals, and print:\n\n```text\nNet: 2000.00 MXN | VAT: 320.00 MXN\n```",
      starter: `gross = 2320
# net = ...
# vat_part = ...
`,
      tests: [
        { kind: "var", variable: "net", expect: 2000.0, hint: "The gross is 116% of the net, so divide by 1.16. Multiplying by 0.84 is a classic mistake." },
        { kind: "var", variable: "vat_part", expect: 320.0, hint: "The VAT part is what's left: gross − net." },
        { kind: "output", label: "Prints both amounts", expect: "Net: 2000.00 MXN | VAT: 320.00 MXN" },
      ],
      hints: [
        "If net × 1.16 = gross, how do you get from gross back to net?",
        "Divide: `gross / 1.16`. Then `vat_part = gross - net`.",
        '`net = round(gross / 1.16, 2)`, `vat_part = round(gross - net, 2)`, then `print(f"Net: {net:.2f} MXN | VAT: {vat_part:.2f} MXN")`.',
      ],
      solution: {
        code: `gross = 2320
net = round(gross / 1.16, 2)
vat_part = round(gross - net, 2)
print(f"Net: {net:.2f} MXN | VAT: {vat_part:.2f} MXN")
`,
        explanation:
          "`2320 / 1.16` gives `2000.0000000000002`, a tiny float error, so `round(…, 2)` → `2000.0`. Then `2320 - 2000.0` → `320.0`. Check: `2000 * 1.16 = 2320`. This is exactly what you need when booking supplier invoices in the accounts.",
      },
      wrongAnswers: [
        `gross = 2320\nnet = round(gross * 0.84, 2)\nvat_part = round(gross - net, 2)\nprint(f"Net: {net:.2f} MXN | VAT: {vat_part:.2f} MXN")\n`,
        `gross = 2320\nnet = round(gross / 1.16, 2)\nvat_part = round(gross * 0.16, 2)\nprint(f"Net: {net:.2f} MXN | VAT: {vat_part:.2f} MXN")\n`,
      ],
    },
  ],
  quiz: [
    {
      id: "round-two",
      kind: "predict",
      question: "What does this print?",
      code: `print(round(1234.5678, 2))`,
      options: ["1234.56", "1234.57", "1234.5678", "1235"],
      answer: 1,
      explanation: "Two decimals, rounded: the third decimal is 7, so .5678 rounds up to .57.",
    },
    {
      id: "float-display",
      kind: "predict",
      question: "What does this print?",
      code: `print(f"{0.1 + 0.2:.2f}")`,
      options: ["0.30000000000000004", "0.3", "0.30", "0.2"],
      answer: 2,
      explanation: "The sum is really `0.30000000000000004`, but `:.2f` displays it with exactly two decimals: `0.30`.",
    },
    {
      id: "vat-choice",
      kind: "choice",
      question: "Which line adds 16% VAT to `price`?",
      options: ["`price + 16`", "`price * 0.16`", "`price * 1.16`", "`price / 1.16`"],
      answer: 2,
      explanation: "`price * 1.16` = the price plus 16% of it. `price * 0.16` is only the VAT part; `price / 1.16` removes VAT from a gross price.",
    },
  ],
});
