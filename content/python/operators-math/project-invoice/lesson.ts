import { defineLesson } from "../../../../src/content/types";

const INPUTS = `nights = 3
rate = 850.0
guests = 2
breakfast_price = 95.0
loyalty_discount = 0.05
vat_rate = 0.16
mxn_per_eur = 21.5
`;

const CALC = `room_total = nights * rate
breakfasts = guests * nights
breakfast_total = breakfasts * breakfast_price
subtotal = room_total + breakfast_total
discount_amount = subtotal * loyalty_discount
net = subtotal - discount_amount
vat_amount = net * vat_rate
total = net + vat_amount
total_eur = total / mxn_per_eur
`;

const INVOICE = `INVOICE - Motel Sol
Room (3 nights x 850.00): 2550.00 MXN
Breakfast (6 x 95.00): 570.00 MXN
Subtotal: 3120.00 MXN
Loyalty discount (5%): -156.00 MXN
Net: 2964.00 MXN
VAT (16%): 474.24 MXN
TOTAL: 3438.24 MXN
TOTAL in EUR: 159.92 EUR`;

const PRINT = `print("INVOICE - Motel Sol")
print(f"Room ({nights} nights x {rate:.2f}): {room_total:.2f} MXN")
print(f"Breakfast ({breakfasts} x {breakfast_price:.2f}): {breakfast_total:.2f} MXN")
print(f"Subtotal: {subtotal:.2f} MXN")
print(f"Loyalty discount ({loyalty_discount * 100:.0f}%): -{discount_amount:.2f} MXN")
print(f"Net: {net:.2f} MXN")
print(f"VAT ({vat_rate * 100:.0f}%): {vat_amount:.2f} MXN")
print(f"TOTAL: {total:.2f} MXN")
print(f"TOTAL in EUR: {total_eur:.2f} EUR")
`;

export default defineLesson({
  goal: "Build a complete invoice calculation (subtotal, discount, VAT, currency) with clear variables and formatted output.",
  exercises: [
    {
      id: "numbers",
      title: "Step 1: the numbers",
      prompt:
        "Using the input variables, create: `room_total`, `breakfasts` (how many breakfasts), `breakfast_total`, `subtotal`, `discount_amount`, `net`, `vat_amount`, `total` and `total_eur`. No rounding yet.",
      starter: INPUTS + "\n# Step 1: calculate each amount in its own variable\n",
      tests: [
        { kind: "var", variable: "room_total", expect: 2550.0 },
        { kind: "var", variable: "breakfasts", expect: 6, hint: "2 guests × 3 days." },
        { kind: "var", variable: "breakfast_total", expect: 570.0 },
        { kind: "var", variable: "subtotal", expect: 3120.0 },
        { kind: "var", variable: "discount_amount", expect: 156.0, hint: "5% of the subtotal: subtotal × 0.05." },
        { kind: "var", variable: "net", expect: 2964.0, hint: "Subtotal minus the discount." },
        { kind: "var", variable: "vat_amount", expect: 474.24, hint: "VAT is calculated on the net amount, after the discount." },
        { kind: "var", variable: "total", expect: 3438.24 },
        { kind: "var", variable: "total_eur", expect: 3438.24 / 21.5 },
        {
          kind: "source",
          label: "Built from the input variables",
          pattern: "3438|2964|474\\.24",
          negate: true,
          message: "Calculate every amount from the input variables instead of typing results.",
        },
      ],
      hints: [
        "Follow the invoice from top to bottom. Each line is one variable.",
        "`breakfasts = guests * nights`, `subtotal = room_total + breakfast_total`, `discount_amount = subtotal * loyalty_discount`.",
        "`net = subtotal - discount_amount`, `vat_amount = net * vat_rate`, `total = net + vat_amount`, `total_eur = total / mxn_per_eur`.",
      ],
      solution: {
        code: INPUTS + "\n" + CALC,
        explanation:
          "Step by step: 3 × 850.0 = 2550.0 · 2 × 3 = 6 breakfasts × 95.0 = 570.0 · subtotal 3120.0 · 5% of 3120.0 = 156.0 · net 2964.0 · 16% of 2964.0 = 474.24 · total 3438.24 · 3438.24 / 21.5 = 159.918… EUR. Because each result has a name, the accountant can check any single line.",
      },
      wrongAnswers: [
        INPUTS + "\n" + CALC.replace("vat_amount = net * vat_rate", "vat_amount = subtotal * vat_rate"),
        INPUTS + "\n" + CALC.replace("breakfasts = guests * nights", "breakfasts = guests + nights"),
      ],
    },
    {
      id: "printout",
      title: "Step 2: the printed invoice",
      prompt:
        "Print the invoice exactly as in the brief. All amounts with 2 decimals. The percentages can be printed from the variables with `{loyalty_discount * 100:.0f}` (no decimals).\n\n```text\n" +
        INVOICE +
        "\n```",
      starter: INPUTS + "\n" + CALC + "\n# Step 2: print the invoice\n",
      tests: [
        { kind: "output", label: "The invoice matches line by line", expect: INVOICE, hint: "Money needs `:.2f`; the discount line has a minus sign before the amount." },
        { kind: "source", label: "Amounts come from variables", pattern: "3438\\.24|159\\.92|474\\.24", negate: true, message: "Use the variables with `:.2f` instead of typing amounts." },
      ],
      hints: [
        'One `print(f"...")` per line.',
        'Money: `{room_total:.2f}`. The discount line: `f"Loyalty discount (5%): -{discount_amount:.2f} MXN"`.',
        'The room line: `print(f"Room ({nights} nights x {rate:.2f}): {room_total:.2f} MXN")`.',
      ],
      solution: {
        code: INPUTS + "\n" + CALC + "\n" + PRINT,
        explanation:
          "Formatting is only done at the very end, in the f-strings: the variables keep full precision (`total_eur` is `159.9181…`), while the printout shows `159.92`. Printing the percentages from the variables means that if VAT changes, only `vat_rate` needs editing.",
      },
      wrongAnswers: [INPUTS + "\n" + CALC + "\n" + PRINT.replace("{total_eur:.2f}", "{total_eur}"), INPUTS + "\n" + CALC + "\n" + PRINT.replace("-{discount_amount:.2f}", "{discount_amount:.2f}")],
    },
  ],
  quiz: [],
});
