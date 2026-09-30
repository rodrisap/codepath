import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Store values in variables, update them, and recognise the four basic types: `int`, `float`, `str` and `bool`.",
  example: {
    intro: "A booking stored in variables. Watch the **Variables** column in the trace: each line adds or changes one value.",
    code: `guest = "Ana Lopez"
nights = 3
rate = 450.0
is_member = True
total = nights * rate
print(guest, "pays", total, "MXN")
nights = 4
print("Nights now:", nights, "| total still:", total)
print(type(nights), type(rate), type(guest), type(is_member))
`,
  },
  tryIt: {
    prompt:
      "Add a line after line 7 that recalculates `total` so it matches the new number of nights, and print it. Then try `print(type(\"450\"))`. Is text that looks like a number still text?",
  },
  exercises: [
    {
      id: "store-booking",
      title: "Store a booking",
      prompt:
        "Create four variables for this booking, with exactly these names and types:\n\n- `guest`: the text `Maria Ruiz`\n- `room`: the whole number `12`\n- `nights`: the whole number `2`\n- `rate`: the decimal number `780.0`",
      starter: `# Create the four variables here
`,
      tests: [
        { kind: "var", variable: "guest", expect: "Maria Ruiz", hint: "Text needs quotes." },
        { kind: "var", variable: "room", expect: 12 },
        { kind: "var", variable: "nights", expect: 2 },
        { kind: "var", variable: "rate", expect: 780.0 },
        {
          kind: "py",
          label: "`room` is an int and `rate` is a float",
          check: `if type(ns.get("room")) is not int:
    fail(f"room should be an int (whole number), but its type is {type(ns.get('room')).__name__}. Did you put it in quotes?")
if type(ns.get("rate")) is not float:
    fail(f"rate should be a float, but its type is {type(ns.get('rate')).__name__}. Write it with a decimal point: 780.0")`,
        },
      ],
      hints: [
        "A variable is created with `name = value`, one per line.",
        "Only the text gets quotes. A float needs a decimal point: `780.0`.",
        '`guest = "Maria Ruiz"`, then `room = 12`, `nights = 2`, `rate = 780.0`.',
      ],
      solution: {
        code: `guest = "Maria Ruiz"
room = 12
nights = 2
rate = 780.0
`,
        explanation:
          '`"Maria Ruiz"` is a `str` because of the quotes. `12` and `2` are `int`s. `780.0` is a `float` because of the decimal point. Writing `"12"` with quotes would make the room number text, and you couldn\'t calculate with it.',
      },
      wrongAnswers: [
        `guest = "Maria Ruiz"\nroom = "12"\nnights = 2\nrate = 780.0\n`,
        `guest = "Maria Ruiz"\nroom = 12\nnights = 2\nrate = 780\n`,
        `Guest = "Maria Ruiz"\nroom = 12\nnights = 2\nrate = 780.0\n`,
      ],
    },
    {
      id: "total-from-vars",
      title: "Calculate with variables",
      prompt:
        "Create a variable `total` that holds the price of the stay (`nights` times `rate`), then print it as `Total: 2600`. Use the variables. Don't type 2600.",
      starter: `nights = 5
rate = 520
# create total and print it
`,
      tests: [
        { kind: "var", variable: "total", expect: 2600, hint: "Check if you multiplied nights by rate." },
        { kind: "output", label: "Prints the total", expect: "Total: 2600" },
        {
          kind: "source",
          label: "Uses the variables, not the number 2600",
          pattern: "total\\s*=\\s*(nights\\s*\\*\\s*rate|rate\\s*\\*\\s*nights)",
          message: "Calculate it from the variables: `total = nights * rate`.",
        },
      ],
      hints: [
        "Create the variable with `total = ...` on its own line.",
        "Multiply the two existing variables. Then print with a comma between the text and `total`.",
        '`total = nights * rate` and `print("Total:", total)`.',
      ],
      solution: {
        code: `nights = 5
rate = 520
total = nights * rate
print("Total:", total)
`,
        explanation:
          "Python evaluates the right side first: `nights * rate` → `5 * 520` → `2600`, then stores it in `total`. Because the calculation uses variables, changing `rate` on line 2 automatically gives the right total the next time you run it.",
      },
      wrongAnswers: [
        `nights = 5\nrate = 520\ntotal = 2600\nprint("Total:", total)\n`,
        `nights = 5\nrate = 520\ntotal = nights + rate\nprint("Total:", total)\n`,
        `nights = 5\nrate = 520\ntotal = nights * rate\nprint("Total:", "total")\n`,
      ],
    },
    {
      id: "raise-rate",
      title: "Update a value",
      prompt:
        "High season: the rate goes up by **50 MXN**. Add a line that increases `rate` **using its current value** (not by typing 500), then print `New rate: 500`.",
      starter: `rate = 450
# increase rate by 50, then print it
`,
      tests: [
        { kind: "var", variable: "rate", expect: 500 },
        { kind: "output", label: "Prints the new rate", expect: "New rate: 500" },
        {
          kind: "source",
          label: "Uses the current value of rate",
          pattern: "rate\\s*=\\s*rate\\s*\\+\\s*50|rate\\s*\\+=\\s*50",
          message: "Build the new value from the old one: `rate = rate + 50`.",
        },
      ],
      hints: [
        "The right side of `=` is calculated first, using the *current* value of `rate`.",
        "So `rate` can appear on both sides of `=`.",
        "`rate = rate + 50` (Python also has a shortcut: `rate += 50`).",
      ],
      solution: {
        code: `rate = 450
rate = rate + 50
print("New rate:", rate)
`,
        explanation:
          "`rate = rate + 50` reads as: take the current rate (450), add 50 → 500, store it back in `rate`. The old value 450 is replaced. `rate += 50` is a common shortcut that does exactly the same.",
      },
      wrongAnswers: [`rate = 450\nrate = 500\nprint("New rate:", rate)\n`, `rate = 450\nnew_rate = rate + 50\nprint("New rate:", new_rate)\n`],
    },
  ],
  quiz: [
    {
      id: "no-auto-update",
      kind: "predict",
      question: "What does this print?",
      code: `nights = 2
total = nights * 100
nights = 5
print(total)
`,
      options: ["500", "200", "nights * 100", "100"],
      answer: 1,
      explanation: "`total` was calculated on line 2, when `nights` was 2. Changing `nights` afterwards doesn't recalculate it: it stays 200.",
    },
    {
      id: "type-of-decimal",
      kind: "predict",
      question: "What does this print?",
      code: `print(type(450.0))`,
      options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "450.0"],
      answer: 1,
      explanation: "The decimal point makes it a `float`, even though the decimals are zero.",
    },
    {
      id: "quoted-name",
      kind: "bug",
      question: "This prints `rate` instead of `450`. Why?",
      code: `rate = 450
print("rate")
`,
      options: [
        "The variable must be created with `==`",
        "`\"rate\"` in quotes is the text r-a-t-e, not the variable",
        "Variables can't be printed",
        "`rate` is a reserved word",
      ],
      answer: 1,
      explanation: "Quotes make text. To print the value stored in the variable, write `print(rate)` without quotes.",
    },
  ],
});
