import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Model a real record as a dictionary: read, change, add and loop over its keys and values.",
  example: {
    intro: "One booking, stored as a dict.",
    code: `booking = {"guest": "Ana Lopez", "room": 7, "nights": 3, "rate": 450}
print(booking["guest"], "is in room", booking["room"])
print("Number of fields:", len(booking))
print("Has an email?", "email" in booking)
total = booking["nights"] * booking["rate"]
booking["nights"] = 4
booking["paid"] = False
email = booking.get("email", "not given")
for key, value in booking.items():
    print(f"{key}: {value}")
print("Total before the change:", total, "| email:", email)
`,
  },
  tryIt: { prompt: "Add a key `\"email\"` to the dict on line 1 and run again: which line's output changes? Then try `booking[\"Email\"]` and read the error." },
  exercises: [
    {
      id: "make-booking",
      title: "Create a booking dict",
      prompt:
        "Create a dict `booking` with these keys and values:\n\n| key | value |\n|---|---|\n| `\"guest\"` | `\"Maria Ruiz\"` |\n| `\"room\"` | `12` |\n| `\"nights\"` | `2` |\n| `\"rate\"` | `780.0` |\n\nThen create `total` from the dict's values (nights × rate).",
      starter: `# booking = {...}
`,
      tests: [
        { kind: "var", variable: "booking", expect: { guest: "Maria Ruiz", room: 12, nights: 2, rate: 780.0 }, hint: "Keys are strings in quotes: `{\"guest\": \"Maria Ruiz\", ...}`." },
        { kind: "var", variable: "total", expect: 1560.0 },
        { kind: "source", label: "Total uses the dict", pattern: "booking\\[[\"']nights[\"']\\]", message: "Calculate from the dict: `booking[\"nights\"] * booking[\"rate\"]`." },
      ],
      hints: [
        "A dict is written with `{ }` and `key: value` pairs separated by commas.",
        '`booking = {"guest": "Maria Ruiz", "room": 12, "nights": 2, "rate": 780.0}`',
        '`total = booking["nights"] * booking["rate"]`',
      ],
      solution: {
        code: `booking = {"guest": "Maria Ruiz", "room": 12, "nights": 2, "rate": 780.0}
total = booking["nights"] * booking["rate"]
`,
        explanation: '`booking["nights"]` → 2 and `booking["rate"]` → 780.0, so `total` = 1560.0. Named fields make the calculation readable: nobody has to remember that "index 2" meant nights.',
      },
      wrongAnswers: [
        `booking = {"guest": "Maria Ruiz", "room": "12", "nights": 2, "rate": 780.0}\ntotal = booking["nights"] * booking["rate"]\n`,
        `booking = {"guest": "Maria Ruiz", "room": 12, "nights": 2, "rate": 780.0}\ntotal = 2 * 780.0\n`,
      ],
    },
    {
      id: "update-booking",
      title: "Update a booking",
      prompt:
        "The guest extends their stay and pays. Update the dict:\n\n1. Add 2 to `\"nights\"` (use the current value).\n2. Add a new key `\"paid\"` with the value `True`.\n3. Remove the key `\"notes\"`.\n4. Set `email` to the booking's email, or `\"none\"` if there isn't one (use `.get`).",
      starter: `booking = {"guest": "Luis", "nights": 3, "notes": "late arrival"}
# 1-3: update the dict
# 4: email = ...
`,
      tests: [
        { kind: "var", variable: "booking", expect: { guest: "Luis", nights: 5, paid: true }, hint: "After all steps the dict has exactly the keys guest, nights and paid." },
        { kind: "var", variable: "email", expect: "none", hint: '`booking.get("email", "none")` returns "none" when the key is missing.' },
        { kind: "source", label: "Uses .get()", pattern: "\\.get\\(", message: "Read the email with `.get(...)` so a missing key doesn't crash." },
      ],
      hints: [
        '`booking["nights"] = booking["nights"] + 2` works just like updating a variable.',
        'Adding a key uses the same syntax as changing one: `booking["paid"] = True`. Removing: `del booking["notes"]`.',
        '`email = booking.get("email", "none")`',
      ],
      solution: {
        code: `booking = {"guest": "Luis", "nights": 3, "notes": "late arrival"}
booking["nights"] = booking["nights"] + 2
booking["paid"] = True
del booking["notes"]
email = booking.get("email", "none")
`,
        explanation: "`booking[\"email\"]` would crash with `KeyError: 'email'`, but `.get(\"email\", \"none\")` returns the fallback. Use `[...]` when the key must exist, `.get` when it may be missing.",
      },
      wrongAnswers: [
        `booking = {"guest": "Luis", "nights": 3, "notes": "late arrival"}\nbooking["nights"] = 2\nbooking["paid"] = True\ndel booking["notes"]\nemail = booking.get("email", "none")\n`,
        `booking = {"guest": "Luis", "nights": 3, "notes": "late arrival"}\nbooking["nights"] = booking["nights"] + 2\nbooking["paid"] = True\nemail = booking.get("email", "none")\n`,
      ],
    },
    {
      id: "count-types",
      title: "Count bookings per room type",
      prompt: "Loop over `room_types` and build a dict `counts` with how many times each type appears, e.g. `{\"double\": 3, ...}`.",
      starter: `room_types = ["double", "single", "double", "family", "double", "single"]
counts = {}
# loop and count
print(counts)
`,
      tests: [
        { kind: "var", variable: "counts", expect: { double: 3, single: 2, family: 1 }, hint: "For a type you haven't seen yet, start its count at 0 (or use `.get(t, 0)`)." },
      ],
      hints: [
        "For each type: if it's already a key, add 1, otherwise set it to 1.",
        "`counts.get(t, 0)` gives the current count, or 0 the first time.",
        "```python\nfor t in room_types:\n    counts[t] = counts.get(t, 0) + 1\n```",
      ],
      solution: {
        code: `room_types = ["double", "single", "double", "family", "double", "single"]
counts = {}
for t in room_types:
    counts[t] = counts.get(t, 0) + 1
print(counts)
`,
        explanation:
          "Round by round: {'double': 1} → {'double': 1, 'single': 1} → {'double': 2, …} → … The `.get(t, 0) + 1` trick is the classic way to count things in Python, much like a COUNTIF in a spreadsheet.",
      },
      wrongAnswers: [
        `room_types = ["double", "single", "double", "family", "double", "single"]\ncounts = {}\nfor t in room_types:\n    counts[t] = 1\nprint(counts)\n`,
      ],
    },
  ],
  quiz: [
    {
      id: "dict-update",
      kind: "predict",
      question: "What does this print?",
      code: `rates = {"single": 400, "double": 550}
rates["double"] = 600
rates["family"] = 750
print(len(rates), rates["double"])
`,
      options: ["2 550", "3 600", "3 550", "4 600"],
      answer: 1,
      explanation: "Line 2 replaces the existing `double` value and line 3 adds a new key, so there are 3 keys and double is 600.",
    },
    {
      id: "get-default",
      kind: "predict",
      question: "What does this print?",
      code: `guest = {"name": "Ana"}
print(guest.get("phone", "unknown"))
`,
      options: ["None", "unknown", "KeyError", "phone"],
      answer: 1,
      explanation: "The key `phone` doesn't exist, so `.get` returns the fallback `\"unknown\"` instead of crashing.",
    },
    {
      id: "key-error",
      kind: "bug",
      question: "This raises `KeyError: 'Nights'`. Why?",
      code: `booking = {"nights": 3}
print(booking["Nights"])
`,
      options: ["Dicts can't hold numbers", "Keys are case-sensitive: `Nights` ≠ `nights`", "You must use `booking.nights`", "The dict needs more than one key"],
      answer: 1,
      explanation: "The key is `\"nights\"` with a lowercase n. Keys must match exactly.",
    },
  ],
});
