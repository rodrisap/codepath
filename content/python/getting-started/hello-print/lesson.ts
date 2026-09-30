import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Write and run a program that prints text and numbers using `print()`.",
  example: {
    intro: "A tiny welcome screen for the motel. Read it top to bottom, then check the output and the step-by-step trace.",
    code: `print("Welcome to Motel Sol")
print("Rooms available:", 12)
print("Price for 3 nights:", 3 * 450, "MXN")
print()
print("Enjoy your stay!")
`,
  },
  tryIt: {
    prompt:
      "Change the example: make it print **your own** motel name, a different number of rooms, and the price for **5** nights at 450 MXN. Predict the output *before* you press Run.",
  },
  exercises: [
    {
      id: "welcome-sign",
      title: "A welcome sign",
      prompt:
        "Print exactly these two lines:\n\n```text\nWelcome to Motel Sol\nCheck-in starts at 15:00\n```",
      starter: `# Print the two lines of the welcome sign below.
`,
      tests: [
        {
          kind: "output",
          label: "Prints both lines exactly",
          expect: "Welcome to Motel Sol\nCheck-in starts at 15:00",
          hint: "Use two print() calls, one per line. Spelling, capitals and spaces must match exactly.",
        },
      ],
      hints: [
        "Each `print(...)` call produces one line of output.",
        'Text must be inside quotes: `print("...")`.',
        'The first line is `print("Welcome to Motel Sol")`. Write the second one the same way.',
      ],
      solution: {
        code: `print("Welcome to Motel Sol")
print("Check-in starts at 15:00")
`,
        explanation:
          "Two `print` calls, each with a string in quotes. Python runs them top to bottom, so the lines appear in that order. `15:00` is inside the quotes, so it's text, not a calculation.",
      },
      wrongAnswers: [`print("Welcome to Motel Sol")\n`, `print("Welcome to motel Sol")\nprint("Check-in starts at 15:00")\n`],
    },
    {
      id: "rooms-line",
      title: "Mixing text and numbers",
      prompt:
        "Motel Sol has **12 rooms**. Print the line `Total rooms: 12`, using a **comma** to put the text and the number `12` in one `print`. Don't put the number inside the quotes.",
      starter: `# Print: Total rooms: 12
`,
      tests: [
        { kind: "output", label: "Prints the line", expect: "Total rooms: 12" },
        {
          kind: "source",
          label: "Uses a comma to join the text and the number",
          pattern: "print\\(\\s*[\"']Total rooms:[\"']\\s*,\\s*12\\s*\\)",
          message: 'Write it as `print("Total rooms:", 12)`: the text in quotes, a comma, then the number without quotes.',
        },
      ],
      hints: [
        "`print` can take several values separated by commas.",
        "Put `Total rooms:` in quotes, with no space at the end: the comma adds the space for you.",
        '`print("Total rooms:", 12)`',
      ],
      solution: {
        code: `print("Total rooms:", 12)
`,
        explanation:
          'The comma separates two values: the string `"Total rooms:"` and the number `12`. `print` puts one space between them, which is why the text doesn\'t need a trailing space.',
      },
      wrongAnswers: [`print("Total rooms: 12")\n`, `print("Total rooms:", 11)\n`],
    },
    {
      id: "calc-in-print",
      title: "Let Python calculate",
      prompt:
        "A guest stays **4 nights** at **520 MXN** per night. Print `Stay total: 2080 MXN`, but **don't type 2080 yourself**: write the calculation `4 * 520` inside the `print` and let Python work it out.",
      starter: `# Let Python calculate 4 nights x 520 MXN
`,
      tests: [
        {
          kind: "output",
          label: "Prints the correct total",
          expect: "Stay total: 2080 MXN",
          hint: "Check the order: text, calculation, then the text MXN, separated by commas.",
        },
        {
          kind: "source",
          label: "Python does the multiplication",
          pattern: "4\\s*\\*\\s*520|520\\s*\\*\\s*4",
          message: "Write the calculation `4 * 520` inside print(), instead of the finished number.",
        },
      ],
      hints: [
        "In Python, `*` means multiply.",
        "You need three values in one print: the text `Stay total:`, the calculation, and the text `MXN`.",
        '`print("Stay total:", 4 * 520, "MXN")`',
      ],
      solution: {
        code: `print("Stay total:", 4 * 520, "MXN")
`,
        explanation:
          'Python first calculates `4 * 520` → `2080`, then prints the three values with spaces in between: `Stay total:` + `2080` + `MXN`. If the rate changes later, you only change one number and the total updates by itself.',
      },
      wrongAnswers: [`print("Stay total: 2080 MXN")\n`, `print("Stay total:", 4 + 520, "MXN")\n`],
    },
  ],
  quiz: [
    {
      id: "predict-commas",
      kind: "predict",
      question: "What does this print?",
      code: `print("Nights:", 2 * 3)`,
      options: ["Nights: 2 * 3", "Nights: 6", "Nights:6", "Nights: 23"],
      answer: 1,
      explanation: "`2 * 3` has no quotes, so Python calculates it (6). The comma adds one space between `Nights:` and `6`.",
    },
    {
      id: "bug-quotes",
      kind: "bug",
      question: "This line crashes. Why?",
      code: `print(Welcome to Motel Sol)`,
      options: [
        "`print` must be written with a capital P",
        "The text is missing its quotes, so Python reads the words as names",
        "You can't print more than one word",
        "There should be a comma after `print`",
      ],
      answer: 1,
      explanation: 'Text needs quotes: `print("Welcome to Motel Sol")`. Without them Python tries to read the words as code, can\'t make sense of them, and stops with a SyntaxError.',
    },
    {
      id: "order",
      kind: "choice",
      question: "In which order does Python run the lines of a program?",
      options: ["All at the same time", "From bottom to top", "From top to bottom, one at a time", "In a random order"],
      answer: 2,
      explanation: "Top to bottom, one line at a time, like following a checklist. Later you'll learn tools (if, loops, functions) that change this order.",
    },
  ],
});
