import { defineLesson } from "../../../../src/content/types";

const FORM = `# Raw data from the booking form (everything is text!)
booking_id = "1042"
guest = "Carlos Mendez"
room = "12"
nights = "3"
rate = "780.50"
mxn_per_eur = 21.5
`;

const CARD = `+------------------------------+
| BOOKING #1042
| Guest:  Carlos Mendez
| Room:   12
| Nights: 3 x 780.50 MXN
| Total:  2341.50 MXN
| In EUR: 108.91 EUR
+------------------------------+`;

const CONVERT = `room_num = int(room)
nights_num = int(nights)
rate_num = float(rate)
total = nights_num * rate_num
total_eur = total / mxn_per_eur
`;

export default defineLesson({
  goal: "Turn raw text data into typed variables, calculate with them, and present the result with f-strings.",
  exercises: [
    {
      id: "convert",
      title: "Step 1: convert and calculate",
      prompt:
        "Below the form data, create these variables:\n\n- `room_num`: the room as an `int`\n- `nights_num`: the nights as an `int`\n- `rate_num`: the rate as a `float`\n- `total`: nights × rate\n- `total_eur`: the total converted to euros",
      starter: FORM + "\n# Step 1: create room_num, nights_num, rate_num, total, total_eur\n",
      tests: [
        { kind: "var", variable: "room_num", expect: 12, hint: "Use int(room)." },
        { kind: "var", variable: "nights_num", expect: 3 },
        { kind: "var", variable: "rate_num", expect: 780.5, hint: 'Use float(rate): the text "780.50" has decimals.' },
        { kind: "var", variable: "total", expect: 2341.5, hint: "Multiply the converted numbers, not the text." },
        { kind: "var", variable: "total_eur", expect: 2341.5 / 21.5, hint: "Pesos → euros: divide by mxn_per_eur." },
        {
          kind: "py",
          label: "Numbers have the right types",
          check: `for name, t in [("room_num", int), ("nights_num", int), ("rate_num", float)]:
    if type(ns.get(name)) is not t:
        fail(f"{name} should be a {t.__name__}, but its type is {type(ns.get(name)).__name__}.")`,
        },
      ],
      hints: [
        "Every value from the form is a `str`. Convert with `int(...)` or `float(...)`.",
        "`room_num = int(room)`. The rate has decimals, so it needs `float(...)`.",
        "`total = nights_num * rate_num` and `total_eur = total / mxn_per_eur`.",
      ],
      solution: {
        code: FORM + "\n" + CONVERT,
        explanation:
          '`int("12")` → `12`, `int("3")` → `3`, `float("780.50")` → `780.5`. Then `3 * 780.5` → `2341.5`, and `2341.5 / 21.5` → `108.90697674418605`. Keeping each step in its own named variable makes the calculation easy to check.',
      },
      wrongAnswers: [
        FORM + "\nroom_num = int(room)\nnights_num = int(nights)\nrate_num = int(float(rate))\ntotal = nights_num * rate_num\ntotal_eur = total / mxn_per_eur\n",
        FORM + "\nroom_num = int(room)\nnights_num = int(nights)\nrate_num = float(rate)\ntotal = nights_num * rate_num\ntotal_eur = total * mxn_per_eur\n",
      ],
    },
    {
      id: "card",
      title: "Step 2: print the card",
      prompt:
        "Now print the booking card exactly like this. Money gets 2 decimals (`:.2f`). The border lines are `+`, 30 `-` signs, `+`.\n\n```text\n" +
        CARD +
        "\n```",
      starter: FORM + "\n" + CONVERT + "\n# Step 2: print the card\n",
      tests: [
        { kind: "output", label: "The card matches line by line", expect: CARD, hint: "Spacing and decimals must match exactly: money needs `:.2f`, and `Guest:` is followed by two spaces." },
        { kind: "source", label: "Uses f-strings", pattern: "\\bf[\"']", message: "Build the lines with f-strings." },
        {
          kind: "source",
          label: "Money is formatted, not typed",
          pattern: "2341\\.50|108\\.91",
          negate: true,
          message: "Don't type the amounts: use `{total:.2f}` and `{total_eur:.2f}`.",
        },
      ],
      hints: [
        'The border is `"+" + "-" * 30 + "+"`.',
        'Each line is one f-string, e.g. `print(f"| Guest:  {guest}")`.',
        'For money: `print(f"| Total:  {total:.2f} MXN")` and `print(f"| Nights: {nights_num} x {rate_num:.2f} MXN")`.',
      ],
      solution: {
        code:
          FORM +
          "\n" +
          CONVERT +
          `
border = "+" + "-" * 30 + "+"
print(border)
print(f"| BOOKING #{booking_id}")
print(f"| Guest:  {guest}")
print(f"| Room:   {room_num}")
print(f"| Nights: {nights_num} x {rate_num:.2f} MXN")
print(f"| Total:  {total:.2f} MXN")
print(f"| In EUR: {total_eur:.2f} EUR")
print(border)
`,
        explanation:
          "Storing the border in a variable avoids typing it twice. `:.2f` turns `780.5` into `780.50` and `108.90697…` into `108.91` for display. The variables keep full precision for any further calculations.",
      },
      wrongAnswers: [
        FORM +
          "\n" +
          CONVERT +
          `
border = "+" + "-" * 30 + "+"
print(border)
print(f"| BOOKING #{booking_id}")
print(f"| Guest:  {guest}")
print(f"| Room:   {room_num}")
print(f"| Nights: {nights_num} x {rate_num} MXN")
print(f"| Total:  {total} MXN")
print(f"| In EUR: {total_eur} EUR")
print(border)
`,
      ],
    },
  ],
  quiz: [],
});
