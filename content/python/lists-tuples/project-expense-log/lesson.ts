import { defineLesson } from "../../../../src/content/types";

const DATA = `expenses = [
    ("2025-03-01", "cleaning", 1200),
    ("2025-03-02", "laundry", 650),
    ("2025-03-05", "electricity", 2350),
    ("2025-03-09", "laundry", 700),
    ("2025-03-12", "repairs", 1900),
    ("2025-03-15", "cleaning", 1200),
    ("2025-03-20", "laundry", 800),
    ("2025-03-28", "water", 540),
]
`;

const LOOKUP = `category = input("Category: ")
count = 0
total = 0
for date, cat, amount in expenses:
    if cat == category:
        count = count + 1
        total = total + amount
print(f"{category}: {count} expenses, {total:.2f} MXN")
`;

const REPORT = `total = 0
biggest = expenses[0]
over_1000 = 0
laundry = 0
for date, category, amount in expenses:
    total = total + amount
    if amount > biggest[2]:
        biggest = (date, category, amount)
    if amount > 1000:
        over_1000 = over_1000 + 1
    if category == "laundry":
        laundry = laundry + amount
print(f"Total: {total:.2f} MXN")
print(f"Biggest: {biggest[0]} {biggest[1]} {biggest[2]} MXN")
print(f"Over 1000 MXN: {over_1000} expenses")
print(f"Share of laundry: {laundry / total * 100:.1f}%")
`;

export default defineLesson({
  goal: "Analyse a real list of records with loops: filter, total, count and find the maximum.",
  exercises: [
    {
      id: "lookup",
      title: "Step 1: category lookup",
      prompt: "Ask `Category: ` and print how many expenses of that category there are and their total, e.g. `laundry: 3 expenses, 2150.00 MXN`. An unknown category gives `0 expenses, 0.00 MXN`.",
      starter: DATA + "\n# ask for a category, then count and total it\n",
      tests: [
        { kind: "output", label: "laundry", stdin: ["laundry"], expect: "Category: laundry\nlaundry: 3 expenses, 2150.00 MXN" },
        { kind: "output", label: "cleaning", stdin: ["cleaning"], expect: "Category: cleaning\ncleaning: 2 expenses, 2400.00 MXN" },
        { kind: "output", label: "unknown category", stdin: ["pool"], expect: "Category: pool\npool: 0 expenses, 0.00 MXN" },
      ],
      hints: [
        "Each tuple has three parts: `for date, cat, amount in expenses:`. Use a different name than `category` for the loop variable, so the user's answer isn't overwritten.",
        "Only count and add when `cat == category`.",
        "Start `count = 0` and `total = 0` before the loop; print once after it.",
      ],
      solution: {
        code: DATA + "\n" + LOOKUP,
        explanation:
          "For laundry: the rows on 03-02 (650), 03-09 (700) and 03-20 (800) match → count 3, total 2150. If you named the loop variable `category`, it would overwrite the user's answer in the first round. Try it with Trace!",
      },
      wrongAnswers: [
        DATA + "\n" + LOOKUP.replace("for date, cat, amount in expenses:\n    if cat == category:", "for date, category, amount in expenses:\n    if category == category:"),
        DATA + "\n" + LOOKUP.replace("        total = total + amount\n", "").replace("print(f\"{category}", "total = count * 650\nprint(f\"{category}"),
      ],
    },
    {
      id: "report",
      title: "Step 2: the month report",
      prompt: "In **one loop**, work out the total, the biggest expense (the whole tuple), how many expenses are over 1000 MXN, and the laundry total. Then print the four lines from the brief.",
      starter: DATA + "\n# one loop, then four print lines\n",
      tests: [
        {
          kind: "output",
          label: "The report",
          expect: "Total: 9340.00 MXN\nBiggest: 2025-03-05 electricity 2350 MXN\nOver 1000 MXN: 4 expenses\nShare of laundry: 23.0%",
          hint: "Share = laundry total ÷ grand total × 100, calculated after the loop.",
        },
        { kind: "source", label: "No shortcuts yet", pattern: "\\b(sum|max|len)\\(", negate: true, message: "Use accumulators in the loop instead of sum/max/len." },
      ],
      hints: [
        "Start `biggest = expenses[0]` (the first tuple), and compare `amount > biggest[2]`.",
        "You need four accumulators: `total`, `biggest`, `over_1000` and `laundry`. Each has its own `if` inside the same loop.",
        "After the loop: `laundry / total * 100` with `:.1f`. Print the biggest as `f\"Biggest: {biggest[0]} {biggest[1]} {biggest[2]} MXN\"`.",
      ],
      solution: {
        code: DATA + "\n" + REPORT,
        explanation:
          "One pass over the data updates all four results. That's how real reports work on big files: read each row once. 2150 / 9340 × 100 = 23.019… → 23.0%. The expenses over 1000 are 1200, 2350, 1900 and 1200 (1000 itself would not count).",
      },
      wrongAnswers: [DATA + "\n" + REPORT.replace("if amount > 1000:", "if amount >= 2000:"), DATA + "\n" + REPORT.replace("{laundry / total * 100:.1f}", "{laundry / 9340:.1f}")],
    },
  ],
  quiz: [],
});
