import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Loop over lists (and lists of tuples) to total, filter and search data.",
  example: {
    intro: "Tonight's bookings as a list of `(guest, nights)` tuples.",
    code: `bookings = [("Ana", 3), ("Luis", 1), ("Marta", 5)]
rate = 450
total_nights = 0
for guest, nights in bookings:
    cost = nights * rate
    total_nights = total_nights + nights
    print(f"{guest}: {nights} nights = {cost} MXN")
print("Total nights:", total_nights)
`,
  },
  tryIt: { prompt: "Add `(\"Jorge\", 2)` to the list and run again. Then add a variable `longest` that remembers the guest with the most nights. (You'll need an `if` inside the loop.)" },
  exercises: [
    {
      id: "payments-total",
      title: "Total and average payment",
      prompt: "Without using `sum()` or `len()`, loop over `payments` to calculate `total` and `count`. Then calculate `average` (total ÷ count) and print `5 payments, total 6510.50, average 1302.10`.",
      starter: `payments = [1350, 890.5, 2100, 450, 1720]
total = 0
count = 0
# loop, then average
`,
      tests: [
        { kind: "var", variable: "total", expect: 6510.5 },
        { kind: "var", variable: "count", expect: 5, hint: "Add 1 to `count` in every round." },
        { kind: "var", variable: "average", expect: 1302.1 },
        { kind: "output", label: "Prints the summary", expect: "5 payments, total 6510.50, average 1302.10" },
        { kind: "source", label: "No sum() or len()", pattern: "\\bsum\\(|\\blen\\(", negate: true, message: "Practise the loop: build the total and the count yourself (sum and len come in module 14)." },
      ],
      hints: [
        "`for amount in payments:` gives you one payment per round.",
        "Each round: `total = total + amount` and `count = count + 1`. After the loop: `average = total / count`.",
        'Print: `print(f"{count} payments, total {total:.2f}, average {average:.2f}")`',
      ],
      solution: {
        code: `payments = [1350, 890.5, 2100, 450, 1720]
total = 0
count = 0
for amount in payments:
    total = total + amount
    count = count + 1
average = total / count
print(f"{count} payments, total {total:.2f}, average {average:.2f}")
`,
        explanation: "Total: 1350 → 2240.5 → 4340.5 → 4790.5 → 6510.5. Count: 1 → 5. Average: 6510.5 / 5 → 1302.1. `sum()` and `len()` do the same in one word, but now you know what they do inside.",
      },
      wrongAnswers: [
        `payments = [1350, 890.5, 2100, 450, 1720]\ntotal = 0\ncount = 0\nfor amount in payments:\n    total = total + amount\naverage = total / 5\nprint(f"{count} payments, total {total:.2f}, average {average:.2f}")\n`,
        `payments = [1350, 890.5, 2100, 450, 1720]\ntotal = 0\ncount = 0\nfor amount in payments:\n    total = amount\n    count = count + 1\naverage = total / count\nprint(f"{count} payments, total {total:.2f}, average {average:.2f}")\n`,
      ],
    },
    {
      id: "filter-rates",
      title: "Filter the premium rates",
      prompt: "Build a **new** list `premium` with only the rates **above 500**, in their original order.",
      starter: `rates = [450, 520, 380, 610, 700, 495, 500]
premium = []
# loop and append
print(premium)
`,
      tests: [
        { kind: "var", variable: "premium", expect: [520, 610, 700], hint: "\"Above 500\" means `> 500`, so 500 itself is not premium." },
        { kind: "var", label: "rates is unchanged", variable: "rates", expect: [450, 520, 380, 610, 700, 495, 500] },
      ],
      hints: [
        "Start with an empty list (already done) and add matching items to it.",
        "Inside the loop: `if rate > 500:` then `premium.append(rate)`.",
        "```python\nfor rate in rates:\n    if rate > 500:\n        premium.append(rate)\n```",
      ],
      solution: {
        code: `rates = [450, 520, 380, 610, 700, 495, 500]
premium = []
for rate in rates:
    if rate > 500:
        premium.append(rate)
print(premium)
`,
        explanation: "The filter pattern: empty list + loop + `if` + `append`. Only 520, 610 and 700 pass `> 500`. The original list is untouched.",
      },
      wrongAnswers: [
        `rates = [450, 520, 380, 610, 700, 495, 500]\npremium = []\nfor rate in rates:\n    if rate >= 500:\n        premium.append(rate)\nprint(premium)\n`,
        `rates = [450, 520, 380, 610, 700, 495, 500]\npremium = []\nfor rate in rates:\n    if rate > 500:\n        premium = [rate]\nprint(premium)\n`,
      ],
    },
    {
      id: "biggest-expense",
      title: "Find the biggest expense",
      prompt:
        "`expenses` is a list of `(category, amount)` tuples. **Without `max()`**, find the biggest one: store its category in `biggest_category` and its amount in `biggest_amount`, then print `Biggest expense: electricity (2350 MXN)`.",
      starter: `expenses = [("cleaning", 1200), ("electricity", 2350), ("laundry", 800), ("repairs", 1900)]
biggest_category = ""
biggest_amount = 0
# loop and compare
`,
      tests: [
        { kind: "var", variable: "biggest_category", expect: "electricity" },
        { kind: "var", variable: "biggest_amount", expect: 2350, hint: "Only replace the biggest when the current amount is larger." },
        { kind: "output", label: "Prints the result", expect: "Biggest expense: electricity (2350 MXN)" },
        { kind: "source", label: "No max()", pattern: "\\bmax\\(", negate: true, message: "Find it with a loop and an `if` (the max-with-key trick comes in module 14)." },
      ],
      hints: [
        "Unpack each tuple: `for category, amount in expenses:`.",
        "`if amount > biggest_amount:` then update **both** variables.",
        '```python\nfor category, amount in expenses:\n    if amount > biggest_amount:\n        biggest_amount = amount\n        biggest_category = category\nprint(f"Biggest expense: {biggest_category} ({biggest_amount} MXN)")\n```',
      ],
      solution: {
        code: `expenses = [("cleaning", 1200), ("electricity", 2350), ("laundry", 800), ("repairs", 1900)]
biggest_category = ""
biggest_amount = 0
for category, amount in expenses:
    if amount > biggest_amount:
        biggest_amount = amount
        biggest_category = category
print(f"Biggest expense: {biggest_category} ({biggest_amount} MXN)")
`,
        explanation: "Round 1: 1200 > 0 → cleaning. Round 2: 2350 > 1200 → electricity. Round 3: 800 > 2350? No. Round 4: 1900 > 2350? No. The \"best so far\" pattern works for any list length.",
      },
      wrongAnswers: [
        `expenses = [("cleaning", 1200), ("electricity", 2350), ("laundry", 800), ("repairs", 1900)]\nbiggest_category = ""\nbiggest_amount = 0\nfor category, amount in expenses:\n    if amount > biggest_amount:\n        biggest_amount = amount\n    biggest_category = category\nprint(f"Biggest expense: {biggest_category} ({biggest_amount} MXN)")\n`,
      ],
    },
  ],
  quiz: [
    {
      id: "unpack",
      kind: "predict",
      question: "What does this print?",
      code: `for room, rate in [(101, 450), (102, 520)]:
    print(room + 1, rate)
`,
      options: ["101 450\n102 520", "102 450\n103 520", "(101, 450)\n(102, 520)", "102 451\n103 521"],
      answer: 1,
      explanation: "Each tuple is unpacked into `room` and `rate`. Only `room` gets +1: 102 450, then 103 520.",
    },
    {
      id: "tuple-change",
      kind: "predict",
      question: "What happens?",
      code: `booking = ("Ana", 3)
booking[1] = 4
print(booking)
`,
      options: ["('Ana', 4)", "('Ana', 3)", "TypeError", "IndexError"],
      answer: 2,
      explanation: "Tuples can't be changed after they are created, so item assignment raises a `TypeError`.",
    },
    {
      id: "count-matches",
      kind: "predict",
      question: "What does this print?",
      code: `nights = [1, 4, 2, 7, 3]
long_stays = 0
for n in nights:
    if n >= 3:
        long_stays = long_stays + 1
print(long_stays)
`,
      options: ["2", "3", "4", "14"],
      answer: 1,
      explanation: "4, 7 and 3 are ≥ 3, so the counter goes up three times.",
    },
  ],
});
