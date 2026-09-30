import { defineLesson } from "../../../../src/content/types";

const ASK = `name = input("Guest name: ")
nights = int(input("Nights: "))
adults = int(input("Adults: "))
rate = float(input("Rate per night: "))
`;

const CALC = `room = nights * rate
breakfast = adults * nights * 95
vat = (room + breakfast) * 0.16
total = room + breakfast + vat
total_eur = total / 21.5
deposit = total * 0.30
`;

const PRINT = `print(f"--- Quote for {name} ---")
print(f"Room: {room:.2f} MXN")
print(f"Breakfast: {breakfast:.2f} MXN")
print(f"VAT (16%): {vat:.2f} MXN")
print(f"Total: {total:.2f} MXN ({total_eur:.2f} EUR)")
print(f"Deposit to confirm (30%): {deposit:.2f} MXN")
`;

const ANA = ["Ana", "3", "2", "650"];
const LUIS = ["Luis", "1", "1", "480.50"];

export default defineLesson({
  goal: "Build a complete input → process → output program that a receptionist could actually use.",
  exercises: [
    {
      id: "numbers",
      title: "Step 1: ask and calculate",
      prompt:
        "Ask the four questions (prompts exactly as in the brief), convert the answers, and calculate `room`, `breakfast`, `vat`, `total`, `total_eur` and `deposit`. Nothing needs to be printed yet.",
      starter: `# Ask the 4 questions, then calculate
`,
      stdin: ANA,
      tests: [
        { kind: "var", variable: "room", expect: 1950.0, hint: "nights × rate." },
        { kind: "var", variable: "breakfast", expect: 570, hint: "95 per adult per night: adults × nights × 95." },
        { kind: "var", variable: "vat", expect: 403.2, hint: "16% of room + breakfast." },
        { kind: "var", variable: "total", expect: 2923.2 },
        { kind: "var", variable: "total_eur", expect: 2923.2 / 21.5 },
        { kind: "var", variable: "deposit", expect: 876.96, hint: "30% of the total, VAT included." },
        { kind: "var", label: "Works with a decimal rate", variable: "total", stdin: LUIS, expect: 667.58, hint: "The rate must be converted with float()." },
      ],
      hints: [
        "Copy the prompts exactly. Nights and adults are whole numbers (`int`), the rate is a `float`.",
        "VAT is on the sum: `(room + breakfast) * 0.16`.",
        "`breakfast = adults * nights * 95`, `total = room + breakfast + vat`, `deposit = total * 0.30`.",
      ],
      solution: {
        code: ASK + "\n" + CALC,
        explanation:
          "For Ana: 3 × 650.0 = 1950.0 · 2 × 3 × 95 = 570 · (1950.0 + 570) × 0.16 = 403.2 · total 2923.2 · 2923.2 / 21.5 = 135.96… EUR · deposit 876.96.",
      },
      wrongAnswers: [ASK + "\n" + CALC.replace("adults * nights * 95", "adults * 95"), ASK.replace('float(input("Rate per night: "))', 'int(input("Rate per night: "))') + "\n" + CALC],
    },
    {
      id: "print-quote",
      title: "Step 2: print the quote",
      prompt: "Now print the quote lines exactly as in the brief, with 2 decimals for every amount.",
      starter: ASK + "\n" + CALC + "\n# print the quote\n",
      tests: [
        {
          kind: "output",
          label: "Quote for Ana",
          stdin: ANA,
          expect: `Guest name: Ana
Nights: 3
Adults: 2
Rate per night: 650
--- Quote for Ana ---
Room: 1950.00 MXN
Breakfast: 570.00 MXN
VAT (16%): 403.20 MXN
Total: 2923.20 MXN (135.96 EUR)
Deposit to confirm (30%): 876.96 MXN`,
          hint: "Every amount needs `:.2f`.",
        },
        {
          kind: "output",
          label: "Quote for Luis (decimal rate)",
          stdin: LUIS,
          expect: `Guest name: Luis
Nights: 1
Adults: 1
Rate per night: 480.50
--- Quote for Luis ---
Room: 480.50 MXN
Breakfast: 95.00 MXN
VAT (16%): 92.08 MXN
Total: 667.58 MXN (31.05 EUR)
Deposit to confirm (30%): 200.27 MXN`,
        },
      ],
      hints: [
        'One `print(f"...")` per line of the quote.',
        'Use `:.2f` on every amount: `f"Room: {room:.2f} MXN"`.',
        'The total line has two amounts: `f"Total: {total:.2f} MXN ({total_eur:.2f} EUR)"`.',
      ],
      solution: {
        code: ASK + "\n" + CALC + "\n" + PRINT,
        explanation:
          "The same program gives a correct quote for any input: that's the point of input → process → output. Notice how `breakfast` is an `int` (570) but `:.2f` still shows it as `570.00`.",
      },
      wrongAnswers: [ASK + "\n" + CALC + "\n" + PRINT.replace("{deposit:.2f}", "{deposit}")],
    },
  ],
  quiz: [],
});
