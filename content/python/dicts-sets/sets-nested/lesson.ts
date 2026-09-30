import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Use sets for unique values and comparisons, and work with nested data (a list of dicts).",
  example: {
    intro: "Four bookings as a list of dicts, which is how data usually looks when it comes from a database.",
    code: `bookings = [
    {"guest": "Ana", "room": 7, "total": 1350},
    {"guest": "Luis", "room": 3, "total": 480},
    {"guest": "Ana", "room": 7, "total": 900},
    {"guest": "Marta", "room": 3, "total": 2250},
]
guests = set()
revenue_per_room = {}
for b in bookings:
    guests.add(b["guest"])
    room = b["room"]
    revenue_per_room[room] = revenue_per_room.get(room, 0) + b["total"]
print("Unique guests:", len(guests), sorted(guests))
print("Revenue per room:", revenue_per_room)
print("Second booking's guest:", bookings[1]["guest"])
`,
  },
  tryIt: { prompt: "Add a fifth booking for a new guest in room 5 and run it again. Then build a set of the *rooms* that were booked." },
  exercises: [
    {
      id: "countries",
      title: "How many countries?",
      prompt: "Create `countries`: a **set** of the unique countries in the guest list. Store how many there are in `num_countries`, and print them sorted: `4 countries: ['Canada', 'Germany', 'Mexico', 'USA']`.",
      starter: `guest_countries = ["Mexico", "USA", "Mexico", "Canada", "USA", "Mexico", "Germany"]
# countries = ...
`,
      tests: [
        { kind: "py", label: "`countries` is the set of unique countries", check: `c = ns.get("countries")
if not isinstance(c, set):
    fail(f"countries should be a set, but it's a {type(c).__name__}. Use set(...).")
if c != {"Mexico", "USA", "Canada", "Germany"}:
    fail(f"countries should be {{'Mexico', 'USA', 'Canada', 'Germany'}} but it is {c}")` },
        { kind: "var", variable: "num_countries", expect: 4 },
        { kind: "output", label: "Prints the sorted countries", expect: "4 countries: ['Canada', 'Germany', 'Mexico', 'USA']", hint: "`sorted(countries)` returns a sorted list." },
      ],
      hints: [
        "`set(a_list)` keeps only the unique values.",
        "`len(countries)` counts them.",
        '`countries = set(guest_countries)`, `num_countries = len(countries)`, `print(f"{num_countries} countries: {sorted(countries)}")`',
      ],
      solution: {
        code: `guest_countries = ["Mexico", "USA", "Mexico", "Canada", "USA", "Mexico", "Germany"]
countries = set(guest_countries)
num_countries = len(countries)
print(f"{num_countries} countries: {sorted(countries)}")
`,
        explanation: "7 entries, but `set()` throws away the duplicates → 4 countries. Sets have no order, so `sorted()` gives a predictable list for printing.",
      },
      wrongAnswers: [
        `guest_countries = ["Mexico", "USA", "Mexico", "Canada", "USA", "Mexico", "Germany"]\ncountries = set(guest_countries)\nnum_countries = len(guest_countries)\nprint(f"{num_countries} countries: {sorted(countries)}")\n`,
        `guest_countries = ["Mexico", "USA", "Mexico", "Canada", "USA", "Mexico", "Germany"]\ncountries = sorted(guest_countries)\nnum_countries = 4\nprint(f"{num_countries} countries: {sorted(set(countries))}")\n`,
      ],
    },
    {
      id: "revenue-per-type",
      title: "Revenue per room type",
      prompt: "`bookings` is a list of dicts. Build `revenue` as a dict of **total revenue per room type**, e.g. `{\"double\": 3150, ...}`, where each booking's revenue is `nights × rate`.",
      starter: `bookings = [
    {"type": "double", "nights": 3, "rate": 550},
    {"type": "single", "nights": 2, "rate": 400},
    {"type": "double", "nights": 3, "rate": 500},
    {"type": "family", "nights": 4, "rate": 750},
    {"type": "single", "nights": 1, "rate": 420},
]
revenue = {}
# loop over the bookings
print(revenue)
`,
      tests: [
        { kind: "var", variable: "revenue", expect: { double: 3150, single: 1220, family: 3000 }, hint: "Each booking adds `b[\"nights\"] * b[\"rate\"]` to its type's total." },
      ],
      hints: [
        "Loop with `for b in bookings:`. Each `b` is one dict.",
        "Calculate the booking's amount: `amount = b[\"nights\"] * b[\"rate\"]`.",
        "`revenue[b[\"type\"]] = revenue.get(b[\"type\"], 0) + amount`",
      ],
      solution: {
        code: `bookings = [
    {"type": "double", "nights": 3, "rate": 550},
    {"type": "single", "nights": 2, "rate": 400},
    {"type": "double", "nights": 3, "rate": 500},
    {"type": "family", "nights": 4, "rate": 750},
    {"type": "single", "nights": 1, "rate": 420},
]
revenue = {}
for b in bookings:
    amount = b["nights"] * b["rate"]
    revenue[b["type"]] = revenue.get(b["type"], 0) + amount
print(revenue)
`,
        explanation: "double: 3×550 + 3×500 = 1650 + 1500 = 3150. single: 800 + 420 = 1220. family: 3000. This is a GROUP BY: you'll write the same thing in one line of SQL in the next track.",
      },
      wrongAnswers: [
        `bookings = [\n    {"type": "double", "nights": 3, "rate": 550},\n    {"type": "single", "nights": 2, "rate": 400},\n    {"type": "double", "nights": 3, "rate": 500},\n    {"type": "family", "nights": 4, "rate": 750},\n    {"type": "single", "nights": 1, "rate": 420},\n]\nrevenue = {}\nfor b in bookings:\n    revenue[b["type"]] = b["nights"] * b["rate"]\nprint(revenue)\n`,
      ],
    },
    {
      id: "returning",
      title: "Returning and new guests",
      prompt: "Using sets, create:\n\n- `returning`: guests who stayed in **both** January and February\n- `new_in_feb`: guests in February who were **not** there in January",
      starter: `january = ["Ana", "Luis", "Marta", "Jorge"]
february = ["Luis", "Sofia", "Ana", "Pedro"]
# returning = ...
# new_in_feb = ...
`,
      tests: [
        { kind: "py", label: "`returning` is correct", check: `r = ns.get("returning")
if r is None:
    fail("Create a variable called returning.")
if set(r) != {"Ana", "Luis"}:
    fail(f"returning should contain Ana and Luis, but it is {r}. Use the & operator on two sets.")` },
        { kind: "py", label: "`new_in_feb` is correct", check: `n = ns.get("new_in_feb")
if n is None:
    fail("Create a variable called new_in_feb.")
if set(n) != {"Sofia", "Pedro"}:
    fail(f"new_in_feb should contain Sofia and Pedro, but it is {n}. Which set do you subtract from which?")` },
      ],
      hints: [
        "Turn both lists into sets first: `set(january)`.",
        "`&` gives what's in both; `-` gives what's in the left one only.",
        "`returning = set(january) & set(february)` and `new_in_feb = set(february) - set(january)`.",
      ],
      solution: {
        code: `january = ["Ana", "Luis", "Marta", "Jorge"]
february = ["Luis", "Sofia", "Ana", "Pedro"]
returning = set(january) & set(february)
new_in_feb = set(february) - set(january)
`,
        explanation: "`&` keeps Ana and Luis (in both). `february - january` keeps Sofia and Pedro. The order matters for `-`: `january - february` would give Marta and Jorge, the guests who didn't come back.",
      },
      wrongAnswers: [
        `january = ["Ana", "Luis", "Marta", "Jorge"]\nfebruary = ["Luis", "Sofia", "Ana", "Pedro"]\nreturning = set(january) | set(february)\nnew_in_feb = set(february) - set(january)\n`,
        `january = ["Ana", "Luis", "Marta", "Jorge"]\nfebruary = ["Luis", "Sofia", "Ana", "Pedro"]\nreturning = set(january) & set(february)\nnew_in_feb = set(january) - set(february)\n`,
      ],
    },
  ],
  quiz: [
    {
      id: "set-dupes",
      kind: "predict",
      question: "What does this print?",
      code: `rooms = {101, 102, 101, 103, 102}
print(len(rooms))
`,
      options: ["5", "3", "2", "101"],
      answer: 1,
      explanation: "A set keeps each value once: {101, 102, 103} → 3.",
    },
    {
      id: "nested-access",
      kind: "predict",
      question: "What does this print?",
      code: `bookings = [{"guest": "Ana", "nights": 3}, {"guest": "Luis", "nights": 1}]
print(bookings[1]["nights"] + bookings[0]["nights"])
`,
      options: ["4", "31", "13", "KeyError"],
      answer: 0,
      explanation: "`bookings[1]` is Luis's dict (nights 1), `bookings[0]` is Ana's (nights 3): 1 + 3 = 4.",
    },
    {
      id: "empty-set",
      kind: "choice",
      question: "How do you create an empty set?",
      options: ["`{}`", "`set()`", "`[]`", "`()`"],
      answer: 1,
      explanation: "`{}` creates an empty *dict*. For an empty set, use `set()`.",
    },
  ],
});
