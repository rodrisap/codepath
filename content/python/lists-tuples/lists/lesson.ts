import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Store many values in a list, pick items with indexes and slices, and change the list with its methods.",
  example: {
    intro: "Tonight's room rates, managed as a list.",
    code: `rates = [450, 520, 380, 610]
first = rates[0]
last = rates[-1]
middle = rates[1:3]
print(first, last, middle, len(rates))
rates.append(700)
rates.remove(380)
rates.sort()
print(rates)
print("Cheapest:", rates[0], "| most expensive:", rates[-1])
print("Is 610 on offer?", 610 in rates)
`,
  },
  tryIt: { prompt: "Try `rates.sort(reverse=True)`, `rates.insert(0, 999)` and `rates.pop()`. Predict the list after each one. Then try `rates[10]` and read the error." },
  exercises: [
    {
      id: "pick-items",
      title: "First, last and a slice",
      prompt:
        "From today's arrivals list, create:\n\n- `first_guest`: the first name\n- `last_guest`: the last name (use a negative index)\n- `middle_guests`: a list with the 2nd, 3rd and 4th names (use a slice)",
      starter: `arrivals = ["Ana", "Luis", "Marta", "Jorge", "Sofia"]
# first_guest = ...
`,
      tests: [
        { kind: "var", variable: "first_guest", expect: "Ana", hint: "Indexes start at 0." },
        { kind: "var", variable: "last_guest", expect: "Sofia" },
        { kind: "var", variable: "middle_guests", expect: ["Luis", "Marta", "Jorge"], hint: "The 2nd item has index 1. A slice stops *before* its end index." },
        { kind: "source", label: "Uses a negative index", pattern: "arrivals\\[-1\\]", message: "Get the last name with `arrivals[-1]`." },
      ],
      hints: [
        "First item: index 0. Last item: index -1.",
        "The 2nd, 3rd and 4th items have indexes 1, 2 and 3. The slice end is the index *after* the last one you want.",
        "`first_guest = arrivals[0]`, `last_guest = arrivals[-1]`, `middle_guests = arrivals[1:4]`.",
      ],
      solution: {
        code: `arrivals = ["Ana", "Luis", "Marta", "Jorge", "Sofia"]
first_guest = arrivals[0]
last_guest = arrivals[-1]
middle_guests = arrivals[1:4]
`,
        explanation: "`arrivals[1:4]` takes indexes 1, 2 and 3 → Luis, Marta, Jorge. `arrivals[-1]` works however long the list gets.",
      },
      wrongAnswers: [
        `arrivals = ["Ana", "Luis", "Marta", "Jorge", "Sofia"]\nfirst_guest = arrivals[1]\nlast_guest = arrivals[-1]\nmiddle_guests = arrivals[1:4]\n`,
        `arrivals = ["Ana", "Luis", "Marta", "Jorge", "Sofia"]\nfirst_guest = arrivals[0]\nlast_guest = arrivals[-1]\nmiddle_guests = arrivals[1:3]\n`,
      ],
    },
    {
      id: "waiting-list",
      title: "Update the waiting list",
      prompt:
        "Update the waiting list in this order:\n\n1. `Carlos` joins at the end.\n2. `Beatriz` cancels (remove her).\n3. `VIP Elena` goes to the **front**.\n4. The person at the end leaves: take them off with `pop()` and store their name in `left`.\n\nThen print the list.",
      starter: `waiting = ["Beatriz", "Tomas", "Rosa"]
# 1. Carlos joins at the end
# 2. Beatriz cancels
# 3. VIP Elena to the front
# 4. the last person leaves → left
print(waiting)
`,
      tests: [
        { kind: "var", variable: "waiting", expect: ["VIP Elena", "Tomas", "Rosa"], hint: "Do the four steps in order; `insert(0, ...)` puts someone at the front." },
        { kind: "var", variable: "left", expect: "Carlos", hint: "`pop()` returns the item it removed: `left = waiting.pop()`." },
        { kind: "output", label: "Prints the final list", expect: "['VIP Elena', 'Tomas', 'Rosa']" },
      ],
      hints: [
        "`waiting.append(\"Carlos\")` adds at the end.",
        "`waiting.remove(\"Beatriz\")`, then `waiting.insert(0, \"VIP Elena\")`.",
        "`left = waiting.pop()` removes the last item *and* gives it to you.",
      ],
      solution: {
        code: `waiting = ["Beatriz", "Tomas", "Rosa"]
waiting.append("Carlos")
waiting.remove("Beatriz")
waiting.insert(0, "VIP Elena")
left = waiting.pop()
print(waiting)
`,
        explanation:
          "Step by step: ['Beatriz', 'Tomas', 'Rosa', 'Carlos'] → ['Tomas', 'Rosa', 'Carlos'] → ['VIP Elena', 'Tomas', 'Rosa', 'Carlos'] → pop removes 'Carlos' → ['VIP Elena', 'Tomas', 'Rosa']. Trace it to watch the list change on each line.",
      },
      wrongAnswers: [
        `waiting = ["Beatriz", "Tomas", "Rosa"]\nwaiting.append("Carlos")\nwaiting.remove("Beatriz")\nwaiting.append("VIP Elena")\nleft = waiting.pop()\nprint(waiting)\n`,
        `waiting = ["Beatriz", "Tomas", "Rosa"]\nwaiting.append("Carlos")\nwaiting.remove("Beatriz")\nwaiting.insert(0, "VIP Elena")\nleft = waiting.pop(0)\nprint(waiting)\n`,
      ],
    },
    {
      id: "top-three",
      title: "The three best-selling rates",
      prompt: "Create `top3`: a list of the **three highest** prices from `sales`, highest first. Keep `sales` itself unchanged (use `sorted`, not `.sort()`).",
      starter: `sales = [1350, 890, 2100, 450, 1720, 980]
# top3 = ...
print(top3)
`,
      tests: [
        { kind: "var", variable: "top3", expect: [2100, 1720, 1350], hint: "Sort from high to low with `reverse=True`, then slice the first 3." },
        { kind: "var", label: "sales is unchanged", variable: "sales", expect: [1350, 890, 2100, 450, 1720, 980], hint: "`sorted(...)` makes a sorted copy; `.sort()` changes the original." },
      ],
      hints: [
        "`sorted(sales, reverse=True)` gives a new list from high to low.",
        "The first three items of a list are the slice `[:3]`.",
        "`top3 = sorted(sales, reverse=True)[:3]`",
      ],
      solution: {
        code: `sales = [1350, 890, 2100, 450, 1720, 980]
top3 = sorted(sales, reverse=True)[:3]
print(top3)
`,
        explanation: "`sorted(sales, reverse=True)` → [2100, 1720, 1350, 980, 890, 450]; `[:3]` keeps positions 0, 1 and 2. `sales` stays in its original order, which matters if other code still needs it.",
      },
      wrongAnswers: [
        `sales = [1350, 890, 2100, 450, 1720, 980]\ntop3 = sorted(sales)[:3]\nprint(top3)\n`,
        `sales = [1350, 890, 2100, 450, 1720, 980]\nsales.sort(reverse=True)\ntop3 = sales[:3]\nprint(top3)\n`,
      ],
    },
  ],
  quiz: [
    {
      id: "negative-slice",
      kind: "predict",
      question: "What does this print?",
      code: `rooms = [101, 102, 103, 104, 105]
print(rooms[-2], rooms[:2])
`,
      options: ["104 [101, 102]", "103 [101, 102, 103]", "104 [102, 103]", "102 [101, 102]"],
      answer: 0,
      explanation: "`-2` is the second-to-last item (104). `[:2]` means from the start up to (not including) index 2: 101 and 102.",
    },
    {
      id: "sort-returns-none",
      kind: "predict",
      question: "What does this print?",
      code: `rates = [3, 1, 2]
result = rates.sort()
print(result, rates)
`,
      options: ["[1, 2, 3] [1, 2, 3]", "None [1, 2, 3]", "[1, 2, 3] [3, 1, 2]", "None [3, 1, 2]"],
      answer: 1,
      explanation: "`.sort()` sorts the list in place and returns `None`. Use `sorted(rates)` if you want a new sorted list.",
    },
    {
      id: "index-error",
      kind: "predict",
      question: "What happens?",
      code: `guests = ["Ana", "Luis", "Marta"]
print(guests[3])
`,
      options: ["Marta", "None", "IndexError", "Ana"],
      answer: 2,
      explanation: "Three items have indexes 0, 1 and 2. Index 3 doesn't exist → `IndexError`.",
    },
  ],
});
