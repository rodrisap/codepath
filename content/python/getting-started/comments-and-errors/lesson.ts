import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Use comments to explain or switch off code, and read an error message to find and fix a bug.",
  example: {
    intro: "This nightly report has a typo on line 6. Notice which lines still produce output, and where the error message points.",
    code: `# Nightly report for Motel Sol
print("Nightly report")   # a comment can follow code, too
print("Guests checked in:", 7)
# print("This line is switched off")
print("Rooms free:", 12 - 7)
print("Revenue:", totl)
print("This line never runs")
`,
    expectError: "NameError",
  },
  tryIt: {
    prompt:
      "Break the example on purpose, in different ways, and read each error from the bottom up: remove a closing `)`, remove a quote, write `Print` with a capital P. Then fix line 6 by replacing `totl` with a number, e.g. `3150`.",
  },
  exercises: [
    {
      id: "comment-out",
      title: "Switch a line off",
      prompt:
        "The pool is closed for repairs. Don't delete the pool line: **comment it out** with `#` so the program prints only:\n\n```text\nBreakfast: 7:00-10:00\nReception open 24h\n```",
      starter: `print("Breakfast: 7:00-10:00")
print("Pool open: 9:00-18:00")
print("Reception open 24h")
`,
      tests: [
        { kind: "output", label: "Prints only the two lines", expect: "Breakfast: 7:00-10:00\nReception open 24h" },
        {
          kind: "source",
          label: "The pool line is still there, commented out",
          pattern: '#\\s*print\\("Pool open: 9:00-18:00"\\)',
          raw: true,
          message: "Keep the pool line in the code, but put a `#` in front of it.",
        },
      ],
      hints: [
        "Python ignores everything after a `#` on a line.",
        "Put `#` at the very start of the pool line.",
        '`# print("Pool open: 9:00-18:00")`',
      ],
      solution: {
        code: `print("Breakfast: 7:00-10:00")
# print("Pool open: 9:00-18:00")
print("Reception open 24h")
`,
        explanation:
          "The `#` turns the whole line into a comment, so Python skips it. Commenting out is handy when you want to switch something off temporarily without losing it.",
      },
      wrongAnswers: [
        `print("Breakfast: 7:00-10:00")
print("Reception open 24h")
`,
        `print("Breakfast: 7:00-10:00")
print("Pool open: 9:00-18:00")
print("Reception open 24h")
`,
      ],
    },
    {
      id: "fix-syntax",
      title: "Fix the SyntaxError",
      prompt:
        "Press **Run** first and read the error from the bottom up. Then fix the line so it prints:\n\n```text\nCheck-out is at 12:00\n```",
      starter: `print("Check-out is at 12:00)
`,
      tests: [{ kind: "output", label: "Prints the check-out time", expect: "Check-out is at 12:00", hint: "Count the quotes." }],
      hints: [
        "The message says `unterminated string literal`: a piece of text was started but never finished.",
        "Every opening `\"` needs a closing `\"` before the `)`.",
        'Add a `"` right after `12:00`: `print("Check-out is at 12:00")`.',
      ],
      solution: {
        code: `print("Check-out is at 12:00")
`,
        explanation:
          "The string started with `\"` but never ended, so Python kept reading until the end of the line. Adding the closing quote before `)` fixes it.",
      },
      wrongAnswers: [`print("Check-out is at 12:00"\n`, `print("Check-out is at 12")\n`],
    },
    {
      id: "fix-three",
      title: "Three bugs in one invoice",
      prompt:
        "This invoice program has **three** bugs. Fix them one at a time: run, read the error, fix, run again. The correct output is:\n\n```text\nInvoice\nNights: 3\nTotal: 1350\n```",
      starter: `Print("Invoice")
print("Nights:", 3
print("Total:" 3 * 450)
`,
      tests: [
        {
          kind: "output",
          label: "Prints the full invoice",
          expect: "Invoice\nNights: 3\nTotal: 1350",
          hint: "Fix one error at a time. After each fix, run again and read the next error.",
        },
      ],
      hints: [
        "Python reports one error at a time. Start with the first line it complains about.",
        "The three bugs: a capital letter, a missing closing bracket, and a missing comma.",
        'Line 1: `print` in lowercase. Line 2: add `)` at the end. Line 3: add a comma: `print("Total:", 3 * 450)`.',
      ],
      solution: {
        code: `print("Invoice")
print("Nights:", 3)
print("Total:", 3 * 450)
`,
        explanation:
          "1) `Print` → `print` (Python is case-sensitive). 2) Line 2 needed its closing `)`. 3) Values in `print` must be separated by commas. Syntax errors are reported first because Python checks whether it can *read* the whole file before running any line.",
      },
      wrongAnswers: [
        `print("Invoice")
print("Nights:", 3)
print("Total:" 3 * 450)
`,
        `Print("Invoice")
print("Nights:", 3)
print("Total:", 3 * 450)
`,
      ],
    },
  ],
  quiz: [
    {
      id: "predict-comments",
      kind: "predict",
      question: "What does this print?",
      code: `# print("A")
print("B")  # print("C")
`,
      options: ["A\nB", "B", "B\nC", "A\nB\nC"],
      answer: 1,
      explanation: "Line 1 is entirely a comment. On line 2, everything after `#` is ignored, so only `B` is printed.",
    },
    {
      id: "read-last-line",
      kind: "choice",
      question: "Where in a Python error message do you find the error type and what went wrong?",
      options: ["The first line", "The last line", "The line with the most text", "It isn't shown; you have to guess"],
      answer: 1,
      explanation: "Read from the bottom up: the last line holds the type (e.g. `NameError`) and the message. The line number is just above it.",
    },
    {
      id: "which-ran",
      kind: "choice",
      question: "A program prints on every line. Line 4 raises a `NameError`. What did you see?",
      options: [
        "Nothing: an error stops the whole program before it starts",
        "The output of lines 1–3, then the error",
        "The output of all lines, then the error",
        "Only the error",
      ],
      answer: 1,
      explanation: "A NameError happens while running, so lines 1–3 already ran. Only a SyntaxError stops everything before the first line runs.",
    },
  ],
});
