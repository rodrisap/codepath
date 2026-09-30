import { defineLesson } from "../../../../src/content/types";

const RECEIPT = `==============================
MOTEL SOL - RECEIPT
==============================
Guest: Ana Lopez
Room: 7 (Double)
Nights: 2
Rate per night: 650 MXN
Room total: 1300 MXN
Breakfast: 2 x 120 MXN = 240 MXN
------------------------------
TOTAL: 1540 MXN
==============================
Thank you for staying with us!`;

export default defineLesson({
  goal: "Combine `print`, text, numbers and calculations to produce a complete, correctly calculated receipt.",
  exercises: [
    {
      id: "header",
      title: "The header",
      prompt:
        'Print the receipt header: a line of **30** `=` signs, the title, and another line of 30 `=` signs. Use `"=" * 30` instead of typing them.\n\n```text\n==============================\nMOTEL SOL - RECEIPT\n==============================\n```',
      starter: `# Line of 30 "=" signs, the title, another line of 30 "=" signs
`,
      tests: [
        {
          kind: "output",
          label: "Prints the header",
          expect: "==============================\nMOTEL SOL - RECEIPT\n==============================",
          hint: "Count carefully: exactly 30 `=` signs per line.",
        },
        {
          kind: "source",
          label: 'Uses "=" * 30',
          pattern: "[\"']=[\"']\\s*\\*\\s*30",
          message: 'Let Python repeat the sign: `print("=" * 30)`.',
        },
      ],
      hints: [
        'A string times a number repeats the string: `"ab" * 3` is `"ababab"`.',
        "You need three `print` calls: separator, title, separator.",
        '`print("=" * 30)` then `print("MOTEL SOL - RECEIPT")` then `print("=" * 30)` again.',
      ],
      solution: {
        code: `print("=" * 30)
print("MOTEL SOL - RECEIPT")
print("=" * 30)
`,
        explanation: '`"=" * 30` builds a string of 30 equal signs. Printing it before and after the title frames the header.',
      },
      wrongAnswers: [
        `print("=" * 20)\nprint("MOTEL SOL - RECEIPT")\nprint("=" * 20)\n`,
        `print("==============================")\nprint("MOTEL SOL - RECEIPT")\nprint("==============================")\n`,
      ],
    },
    {
      id: "full-receipt",
      title: "The full receipt",
      prompt:
        "Print the complete receipt below. The **room total**, **breakfast total** and **TOTAL** must be calculated by Python (e.g. `2 * 650`). Don't type 1300, 240 or 1540 yourself.\n\n```text\n" +
        RECEIPT +
        "\n```\n\nThe dashed line is 30 `-` signs.",
      starter: `print("=" * 30)
print("MOTEL SOL - RECEIPT")
print("=" * 30)
print("Guest: Ana Lopez")
# ... continue here
`,
      tests: [
        {
          kind: "output",
          label: "The receipt matches line by line",
          expect: RECEIPT,
          hint: "Compare your output with the example line by line; the message tells you which line differs.",
        },
        {
          kind: "source",
          label: "Room total is calculated",
          pattern: "2\\s*\\*\\s*650|650\\s*\\*\\s*2",
          message: "Calculate the room total with `2 * 650` inside print().",
        },
        {
          kind: "source",
          label: "Grand total is calculated, not typed",
          pattern: "1540",
          negate: true,
          message: "Don't type 1540: calculate it, e.g. `2 * 650 + 2 * 120`.",
        },
      ],
      hints: [
        "Work line by line. Lines with a number that is *given* (like `Nights: 2`) can use a comma: `print(\"Nights:\", 2)`.",
        'For the breakfast line you need four pieces: `print("Breakfast: 2 x 120 MXN =", 2 * 120, "MXN")`.',
        'The total line: `print("TOTAL:", 2 * 650 + 2 * 120, "MXN")`. Python does `*` before `+`, so it calculates 1300 + 240.',
      ],
      solution: {
        code: `print("=" * 30)
print("MOTEL SOL - RECEIPT")
print("=" * 30)
print("Guest: Ana Lopez")
print("Room: 7 (Double)")
print("Nights:", 2)
print("Rate per night:", 650, "MXN")
print("Room total:", 2 * 650, "MXN")
print("Breakfast: 2 x 120 MXN =", 2 * 120, "MXN")
print("-" * 30)
print("TOTAL:", 2 * 650 + 2 * 120, "MXN")
print("=" * 30)
print("Thank you for staying with us!")
`,
        explanation:
          "Every amount is calculated, so the receipt can't contain an arithmetic slip. In the total, Python multiplies first (`2 * 650 = 1300`, `2 * 120 = 240`) and then adds (`1300 + 240 = 1540`). You'll see exactly why in Module 3.\n\nNotice how much we repeat `650` and `2`. In the next module, **variables** fix that: you'll write `nights = 2` once and reuse it everywhere.",
      },
      wrongAnswers: [
        `print("=" * 30)
print("MOTEL SOL - RECEIPT")
print("=" * 30)
print("Guest: Ana Lopez")
print("Room: 7 (Double)")
print("Nights:", 2)
print("Rate per night:", 650, "MXN")
print("Room total:", 2 * 650, "MXN")
print("Breakfast: 2 x 120 MXN =", 2 * 120, "MXN")
print("-" * 30)
print("TOTAL:", 1540, "MXN")
print("=" * 30)
print("Thank you for staying with us!")
`,
        `print("=" * 30)
print("MOTEL SOL - RECEIPT")
print("=" * 30)
print("Guest: Ana Lopez")
print("Room: 7 (Double)")
print("Nights:", 2)
print("Rate per night:", 650, "MXN")
print("Room total:", 2 * 650, "MXN")
print("Breakfast: 2 x 120 MXN =", 2 * 120, "MXN")
print("-" * 30)
print("TOTAL:", 2 * 650 + 120, "MXN")
print("=" * 30)
print("Thank you for staying with us!")
`,
      ],
    },
  ],
  quiz: [],
});
