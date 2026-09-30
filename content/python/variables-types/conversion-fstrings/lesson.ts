import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Convert between text and numbers with `int()`, `float()` and `str()`, and build clean output with f-strings.",
  example: {
    intro: "A price arrives as text (as it would from a form). We convert it, calculate, and print it in three different ways.",
    code: `price_text = "450"
nights = 3
price = int(price_text)
total = price * nights
label = "Room " + str(7)
avg = total / nights
print(label, "total:", total)
print(f"{label}: {nights} nights x {price} MXN = {total} MXN")
print(f"Average per night: {avg:.2f} MXN")
year_revenue = 1234567.891
print(f"Year revenue: {year_revenue:,.2f} MXN")
`,
  },
  tryIt: {
    prompt:
      "Change line 3 to `price = price_text` (no conversion) and run it. What does line 4 produce now? Then put it back and try `{avg:.0f}` and `{year_revenue:,.0f}` in the f-strings.",
  },
  exercises: [
    {
      id: "fix-text-math",
      title: "A strange total",
      prompt:
        "This program prints something very strange instead of `Total: 2000`. Run it, figure out why, and fix it with a conversion.",
      starter: `nights_text = "4"
rate = 500
total = nights_text * rate
print("Total:", total)
`,
      tests: [
        { kind: "output", label: "Prints the correct total", expect: "Total: 2000" },
        {
          kind: "source",
          label: "Converts the text with int()",
          pattern: "int\\(\\s*nights_text\\s*\\)",
          message: "Convert the text to a number with `int(nights_text)`.",
        },
      ],
      hints: [
        'What is the type of `"4"`? What does text times a number do?',
        "`nights_text` must become a number before the multiplication.",
        "`total = int(nights_text) * rate`",
      ],
      solution: {
        code: `nights_text = "4"
rate = 500
total = int(nights_text) * rate
print("Total:", total)
`,
        explanation:
          '`"4" * 500` repeats the text `"4"` five hundred times, which is valid Python but not what we meant. `int(nights_text)` converts `"4"` to the number `4`, so `4 * 500` → `2000`.',
      },
      wrongAnswers: [`nights_text = "4"\nrate = 500\ntotal = 4 * rate\nprint("Total:", total)\n`, `nights_text = "4"\nrate = 500\ntotal = str(nights_text) * rate\nprint("Total:", total)\n`],
    },
    {
      id: "fstring-sentence",
      title: "A sentence with an f-string",
      prompt: "Using **one f-string**, print:\n\n```text\nAna is in room 7 for 3 nights.\n```\n\nUse the variables. Don't type the name or numbers into the text.",
      starter: `guest = "Ana"
room = 7
nights = 3
# print the sentence with an f-string
`,
      tests: [
        { kind: "output", label: "Prints the sentence", expect: "Ana is in room 7 for 3 nights." },
        { kind: "source", label: "Uses an f-string", pattern: "\\bf[\"']", message: 'Start the text with `f"`, e.g. `f"{guest} is ..."`.' },
        {
          kind: "source",
          label: "Uses all three variables",
          pattern: "\\{guest\\}[\\s\\S]*\\{room\\}[\\s\\S]*\\{nights\\}",
          message: "Put `{guest}`, `{room}` and `{nights}` inside the f-string.",
        },
      ],
      hints: [
        'An f-string starts with `f` right before the quote: `f"..."`.',
        "Inside it, write `{guest}` where the name should appear. Same for room and nights.",
        '`print(f"{guest} is in room {room} for {nights} nights.")`',
      ],
      solution: {
        code: `guest = "Ana"
room = 7
nights = 3
print(f"{guest} is in room {room} for {nights} nights.")
`,
        explanation: "Each `{…}` is replaced by the variable's current value. f-strings convert numbers to text automatically, so no `str()` is needed.",
      },
      wrongAnswers: [
        `guest = "Ana"\nroom = 7\nnights = 3\nprint("Ana is in room 7 for 3 nights.")\n`,
        `guest = "Ana"\nroom = 7\nnights = 3\nprint("{guest} is in room {room} for {nights} nights.")\n`,
      ],
    },
    {
      id: "mxn-to-eur",
      title: "Pesos to euros, 2 decimals",
      prompt:
        "The exchange rate is **21.5 MXN per euro**. Print how much 1350 MXN is in euros, with **exactly 2 decimals**:\n\n```text\n1350 MXN is about 62.79 EUR\n```",
      starter: `mxn = 1350
mxn_per_eur = 21.5
# calculate and print with 2 decimals
`,
      tests: [
        {
          kind: "output",
          label: "Prints the amount with 2 decimals",
          expect: "1350 MXN is about 62.79 EUR",
          hint: "Pesos → euros means dividing by the rate. Format with `:.2f` inside the braces.",
        },
      ],
      hints: [
        "1 euro costs 21.5 pesos, so the number of euros is the pesos divided by 21.5.",
        "You can calculate inside the braces of an f-string: `{mxn / mxn_per_eur}`. Add `:.2f` for 2 decimals.",
        '`print(f"{mxn} MXN is about {mxn / mxn_per_eur:.2f} EUR")`',
      ],
      solution: {
        code: `mxn = 1350
mxn_per_eur = 21.5
eur = mxn / mxn_per_eur
print(f"{mxn} MXN is about {eur:.2f} EUR")
`,
        explanation:
          "`1350 / 21.5` → `62.7906976744186`. The format `:.2f` shows it rounded to 2 decimals: `62.79`. The variable `eur` still holds the full value; only the printed text is rounded.",
      },
      wrongAnswers: [
        `mxn = 1350\nmxn_per_eur = 21.5\nprint(f"{mxn} MXN is about {mxn / mxn_per_eur} EUR")\n`,
        `mxn = 1350\nmxn_per_eur = 21.5\nprint(f"{mxn} MXN is about {mxn * mxn_per_eur:.2f} EUR")\n`,
      ],
    },
  ],
  quiz: [
    {
      id: "text-plus-text",
      kind: "predict",
      question: "What does this print?",
      code: `print("5" + "5")`,
      options: ["10", "55", "TypeError", "5 5"],
      answer: 1,
      explanation: "Both are text, so `+` glues them together: `\"55\"`. To add numbers, convert first: `int(\"5\") + int(\"5\")` → 10.",
    },
    {
      id: "format-one-decimal",
      kind: "predict",
      question: "What does this print?",
      code: `x = 7.456
print(f"{x:.1f}")
`,
      options: ["7.4", "7.5", "7.456", "7"],
      answer: 1,
      explanation: "`:.1f` shows one decimal, rounded: 7.456 → 7.5.",
    },
    {
      id: "int-of-decimal-text",
      kind: "predict",
      question: "What happens?",
      code: `print(int("12.5"))`,
      options: ["12", "12.5", "13", "ValueError"],
      answer: 3,
      explanation: '`int()` only accepts text that looks like a whole number. `"12.5"` has a decimal point, so you get `ValueError`. Use `float("12.5")` instead.',
    },
  ],
});
