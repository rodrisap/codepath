import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Ask the user for values with `input()`, convert them to numbers, and use them in a calculation.",
  example: {
    intro: "A tiny price calculator. When it runs, the typed answers are `Ana`, `3` and `450`.",
    code: `name = input("Guest name: ")
nights = int(input("Nights: "))
rate = float(input("Rate per night (MXN): "))
total = nights * rate
print(f"{name}: {nights} nights x {rate:.2f} = {total:.2f} MXN")
`,
    stdin: ["Ana", "3", "450"],
  },
  tryIt: {
    prompt:
      "Run it and type your own answers. Then try typing `abc` for the nights and read the error. Finally, remove the `int(...)` around the nights question. What does the total look like now?",
  },
  exercises: [
    {
      id: "greet",
      title: "Welcome the guest",
      prompt: "Ask `Your name? ` and then print `Welcome, <name>!`. For example, if the guest types `Ana`:\n\n```text\nYour name? Ana\nWelcome, Ana!\n```",
      starter: `# Ask for the name, then welcome the guest
`,
      tests: [
        { kind: "output", label: "Works for Ana", stdin: ["Ana"], expect: "Your name? Ana\nWelcome, Ana!", hint: 'The prompt is exactly `"Your name? "` (with a space at the end).' },
        { kind: "output", label: "Works for Luis", stdin: ["Luis"], expect: "Your name? Luis\nWelcome, Luis!" },
      ],
      hints: [
        "Store the answer of `input(...)` in a variable.",
        'The prompt text goes inside the brackets: `input("Your name? ")`.',
        '`name = input("Your name? ")` then `print(f"Welcome, {name}!")`.',
      ],
      solution: {
        code: `name = input("Your name? ")
print(f"Welcome, {name}!")
`,
        explanation: "`input` shows the prompt, waits, and returns what was typed. Because a name is text anyway, no conversion is needed.",
      },
      wrongAnswers: [`name = input("Your name? ")\nprint("Welcome, Ana!")\n`, `name = input("Your name?")\nprint(f"Welcome, {name}!")\n`],
    },
    {
      id: "nights-total",
      title: "Nights × rate",
      prompt:
        "Ask `Nights? ` and `Rate? ` (both whole numbers), then print the total. With `3` and `450`:\n\n```text\nNights? 3\nRate? 450\nTotal: 1350\n```",
      starter: `# Ask for nights and rate, convert them, print the total
`,
      tests: [
        { kind: "output", label: "3 nights at 450", stdin: ["3", "450"], expect: "Nights? 3\nRate? 450\nTotal: 1350", hint: "Did you convert both answers with int()?" },
        { kind: "output", label: "2 nights at 800", stdin: ["2", "800"], expect: "Nights? 2\nRate? 800\nTotal: 1600" },
      ],
      hints: [
        "Two `input` calls, one per question. Each answer is text.",
        "Wrap each `input(...)` in `int(...)` so you can multiply.",
        '`nights = int(input("Nights? "))`, `rate = int(input("Rate? "))`, `print("Total:", nights * rate)`.',
      ],
      solution: {
        code: `nights = int(input("Nights? "))
rate = int(input("Rate? "))
print("Total:", nights * rate)
`,
        explanation: 'For the first test: `input` returns `"3"` → `int("3")` → `3`; same for the rate → `450`; then `3 * 450` → `1350`.',
      },
      wrongAnswers: [`nights = input("Nights? ")\nrate = int(input("Rate? "))\nprint("Total:", nights * rate)\n`, `nights = int(input("Nights? "))\nrate = int(input("Rate? "))\nprint("Total:", nights + rate)\n`],
    },
    {
      id: "mxn-to-eur",
      title: "A currency converter",
      prompt:
        "Ask `Amount in MXN: ` (it can have decimals) and print the amount in euros with 2 decimals, at 21.5 MXN per euro:\n\n```text\nAmount in MXN: 1000\n= 46.51 EUR\n```",
      starter: `mxn_per_eur = 21.5
# ask for the amount, convert, print
`,
      tests: [
        { kind: "output", label: "1000 MXN", stdin: ["1000"], expect: "Amount in MXN: 1000\n= 46.51 EUR", hint: "Divide by the rate and format with `:.2f`." },
        { kind: "output", label: "215.5 MXN", stdin: ["215.5"], expect: "Amount in MXN: 215.5\n= 10.02 EUR", hint: "Decimals in the input need `float(...)`, not `int(...)`." },
      ],
      hints: [
        "Money can have decimals, so convert with `float(...)`.",
        "Pesos → euros: divide by `mxn_per_eur`.",
        '`amount = float(input("Amount in MXN: "))` then `print(f"= {amount / mxn_per_eur:.2f} EUR")`.',
      ],
      solution: {
        code: `mxn_per_eur = 21.5
amount = float(input("Amount in MXN: "))
eur = amount / mxn_per_eur
print(f"= {eur:.2f} EUR")
`,
        explanation: '`float("215.5")` → `215.5`; `215.5 / 21.5` → `10.0232…`; shown as `10.02`. With `int(...)` the second test would crash, because `"215.5"` isn\'t a whole number.',
      },
      wrongAnswers: [
        `mxn_per_eur = 21.5\namount = int(input("Amount in MXN: "))\nprint(f"= {amount / mxn_per_eur:.2f} EUR")\n`,
        `mxn_per_eur = 21.5\namount = float(input("Amount in MXN: "))\nprint(f"= {amount * mxn_per_eur:.2f} EUR")\n`,
      ],
    },
  ],
  quiz: [
    {
      id: "input-is-text",
      kind: "predict",
      question: "The user types `5`. What is shown?",
      code: `x = input("Number: ")
print(x * 2)
`,
      stdin: ["5"],
      options: ["Number: 5\n10", "Number: 5\n55", "Number: 5\nTypeError", "10"],
      answer: 1,
      explanation: '`input` returns the text `"5"`, and text times 2 repeats it: `"55"`. Use `int(input(...))` to get 10.',
    },
    {
      id: "input-type",
      kind: "choice",
      question: "The user types `42` at `answer = input()`. What is the type of `answer`?",
      options: ["`int`", "`float`", "`str`", "It depends on what was typed"],
      answer: 2,
      explanation: "`input()` always returns a `str`. Converting is your job.",
    },
    {
      id: "input-bug",
      kind: "bug",
      question: "This crashes on line 2 when the user types `3`. Why?",
      code: `nights = input("Nights: ")
print("Next week:", nights + 7)
`,
      options: [
        "`print` can't show a sum",
        '`nights` is the text `"3"`, and text can\'t be added to a number',
        "The prompt needs a question mark",
        "`7` must be in quotes",
      ],
      answer: 1,
      explanation: 'Line 1 stores `"3"` (a str). `"3" + 7` → `TypeError`. Fix: `nights = int(input("Nights: "))`.',
    },
  ],
});
