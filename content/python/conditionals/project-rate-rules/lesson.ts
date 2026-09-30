import { defineLesson } from "../../../../src/content/types";

const SEASON = `if month == 12 or month == 1:
    season = "high"
    rate = 750
elif 6 <= month <= 8:
    season = "summer"
    rate = 600
else:
    season = "low"
    rate = 450
`;

const FULL = `month = int(input("Month: "))
nights = int(input("Nights: "))
guests = int(input("Guests: "))

${SEASON}
print(f"Season: {season} ({rate} MXN/night)")

extra = 0
if guests > 2:
    extra = (guests - 2) * 150
    print(f"Extra guest fee: {extra} MXN/night")

subtotal = nights * (rate + extra)
print(f"Subtotal: {subtotal:.2f} MXN")

discount = 0
if nights >= 7:
    discount = subtotal * 0.10
    print(f"Weekly discount: -{discount:.2f} MXN")

total = subtotal - discount
print(f"Total: {total:.2f} MXN")
`;

export default defineLesson({
  goal: "Turn real business rules into an `if/elif/else` program and test it on edge cases.",
  exercises: [
    {
      id: "season",
      title: "Step 1: the season rate",
      prompt: "Ask `Month: ` (1–12) and set two variables: `season` (`\"high\"`, `\"summer\"` or `\"low\"`) and `rate` (750, 600 or 450), following the table in the brief.",
      starter: `month = int(input("Month: "))
# set season and rate
`,
      tests: [
        { kind: "var", label: "December is high", stdin: ["12"], variable: "season", expect: "high" },
        { kind: "var", label: "January costs 750", stdin: ["1"], variable: "rate", expect: 750 },
        { kind: "var", label: "June is summer", stdin: ["6"], variable: "season", expect: "summer", hint: "Summer is months 6, 7 and 8: `6 <= month <= 8`." },
        { kind: "var", label: "August costs 600", stdin: ["8"], variable: "rate", expect: 600 },
        { kind: "var", label: "September is low", stdin: ["9"], variable: "season", expect: "low" },
        { kind: "var", label: "May costs 450", stdin: ["5"], variable: "rate", expect: 450 },
      ],
      hints: [
        "Three seasons → `if`, `elif`, `else`. Set both variables in each branch.",
        "High season is month 12 **or** month 1. Summer is between 6 and 8 inclusive.",
        '`if month == 12 or month == 1:` … `elif 6 <= month <= 8:` … `else:` …',
      ],
      solution: {
        code: `month = int(input("Month: "))\n${SEASON}`,
        explanation: "`6 <= month <= 8` is Python shorthand for `month >= 6 and month <= 8`. Testing the edges (1, 6, 8, 12) is what catches off-by-one mistakes.",
      },
      wrongAnswers: [
        `month = int(input("Month: "))\n${SEASON.replace("6 <= month <= 8", "6 < month < 8")}`,
        `month = int(input("Month: "))\n${SEASON.replace('month == 12 or month == 1', 'month == 12')}`,
      ],
    },
    {
      id: "full-quote",
      title: "Step 2: the full price",
      prompt: "Now ask all three questions (`Month: `, `Nights: `, `Guests: `) and print the quote exactly like the brief, including the optional lines.",
      starter: `month = int(input("Month: "))
nights = int(input("Nights: "))
guests = int(input("Guests: "))
# season, extra guests, subtotal, discount, total
`,
      tests: [
        {
          kind: "output",
          label: "Summer, 8 nights, 3 guests",
          stdin: ["7", "8", "3"],
          expect: `Month: 7
Nights: 8
Guests: 3
Season: summer (600 MXN/night)
Extra guest fee: 150 MXN/night
Subtotal: 6000.00 MXN
Weekly discount: -600.00 MXN
Total: 5400.00 MXN`,
          hint: "The extra fee is added to the rate for every night: nights × (rate + extra).",
        },
        {
          kind: "output",
          label: "High season, 2 nights, 2 guests (no optional lines)",
          stdin: ["1", "2", "2"],
          expect: `Month: 1
Nights: 2
Guests: 2
Season: high (750 MXN/night)
Subtotal: 1500.00 MXN
Total: 1500.00 MXN`,
        },
        {
          kind: "output",
          label: "Low season, exactly 7 nights, 4 guests",
          stdin: ["4", "7", "4"],
          expect: `Month: 4
Nights: 7
Guests: 4
Season: low (450 MXN/night)
Extra guest fee: 300 MXN/night
Subtotal: 5250.00 MXN
Weekly discount: -525.00 MXN
Total: 4725.00 MXN`,
          hint: "7 nights is exactly a week: use `>= 7`.",
        },
      ],
      hints: [
        "Start `extra` and `discount` at 0 *before* their if-statements, so they exist even when the rule doesn't apply.",
        "Extra fee per night: `(guests - 2) * 150`. Subtotal: `nights * (rate + extra)`.",
        "Only print the optional lines *inside* their `if` blocks; the Subtotal and Total lines are not indented.",
      ],
      solution: {
        code: FULL,
        explanation:
          "Setting `extra = 0` and `discount = 0` first means the later lines work in every case. For the first test: summer 600, 1 extra guest → 150/night, 8 × 750 = 6000.0, 10% → 600.0, total 5400.0.",
      },
      wrongAnswers: [FULL.replace("nights * (rate + extra)", "nights * rate + extra"), FULL.replace("if nights >= 7:", "if nights > 7:")],
    },
  ],
  quiz: [],
});
