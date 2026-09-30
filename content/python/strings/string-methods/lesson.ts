import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Clean, split, join and format text with string methods and f-string alignment.",
  example: {
    intro: "Tidying up data typed in a hurry at the front desk.",
    code: `raw = "  ana LOPEZ  "
name = raw.strip().title()
email = "Ana.Lopez@Mail.com".lower()
code = "MX-2025-0042"
parts = code.split("-")
year = parts[1]
print(name, "|", email, "|", parts, "|", year)
print(name.upper(), len(name), name.startswith("Ana"))
print(name.replace("Lopez", "Lopez Ruiz"))
print(" | ".join(["Ana", "Luis", "Marta"]))
print(f"{'Room':<8}{'Rate':>8}")
print(f"{'101':<8}{450:>8}")
`,
  },
  tryIt: { prompt: "Print `name[0]`, `name[-5:]` and `code.lower().replace(\"-\", \"/\")`. Predict each result first. Then try `year + 1` and read the error." },
  exercises: [
    {
      id: "clean-name",
      title: "Clean a name",
      prompt: "Write `clean_name(raw)` that removes surrounding spaces and returns the name in *Title Case*.",
      starter: `def clean_name(raw):
    pass
`,
      tests: [
        { kind: "call", call: 'clean_name("  ana LOPEZ ")', expect: "Ana Lopez" },
        { kind: "call", call: 'clean_name("JOHN smith")', expect: "John Smith" },
        { kind: "call", call: 'clean_name("lena")', expect: "Lena" },
      ],
      hints: [
        "Two methods: one removes the spaces, one fixes the capitals.",
        "Methods can be chained: `raw.strip().title()`.",
        "```python\ndef clean_name(raw):\n    return raw.strip().title()\n```",
      ],
      solution: {
        code: `def clean_name(raw):
    return raw.strip().title()
`,
        explanation: '`"  ana LOPEZ ".strip()` → `"ana LOPEZ"` → `.title()` → `"Ana Lopez"`. Each method returns a new string that the next method works on.',
      },
      wrongAnswers: [`def clean_name(raw):\n    return raw.title()\n`, `def clean_name(raw):\n    raw.strip().title()\n    return raw\n`],
    },
    {
      id: "initials",
      title: "Initials",
      prompt: 'Write `initials(full_name)` that returns the initials in capitals, each followed by a dot: `"ana lopez"` → `"A.L."`.',
      starter: `def initials(full_name):
    pass
`,
      tests: [
        { kind: "call", call: 'initials("ana lopez")', expect: "A.L." },
        { kind: "call", call: 'initials("Maria del Carmen Ruiz")', expect: "M.D.C.R." },
        { kind: "call", call: 'initials("  Lena   Vogel ")', expect: "L.V.", hint: "`.split()` without an argument splits on any run of spaces and ignores spaces at the ends." },
      ],
      hints: [
        "`.split()` gives you a list of words.",
        "Loop over the words and build the result: `result = result + word[0].upper() + \".\"`.",
        '```python\ndef initials(full_name):\n    result = ""\n    for word in full_name.split():\n        result = result + word[0].upper() + "."\n    return result\n```',
      ],
      solution: {
        code: `def initials(full_name):
    result = ""
    for word in full_name.split():
        result = result + word[0].upper() + "."
    return result
`,
        explanation: '`"  Lena   Vogel ".split()` → `["Lena", "Vogel"]` (no empty pieces). Then `"" + "L" + "."` → `"L."`, then `"L." + "V" + "."` → `"L.V."`. The same accumulator pattern as with numbers, but with text.',
      },
      wrongAnswers: [
        `def initials(full_name):\n    result = ""\n    for word in full_name.split(" "):\n        result = result + word[0].upper() + "."\n    return result\n`,
        `def initials(full_name):\n    result = ""\n    for word in full_name.split():\n        result = result + word[0] + "."\n    return result\n`,
      ],
    },
    {
      id: "booking-code",
      title: "Booking codes",
      prompt: 'Write `booking_code(room, year, number)` that returns codes like `"R7-2025-0042"`: `R` + room, the year, and the number padded with zeros to 4 digits.',
      starter: `def booking_code(room, year, number):
    pass
`,
      tests: [
        { kind: "call", call: "booking_code(7, 2025, 42)", expect: "R7-2025-0042", hint: "`{number:04d}` pads with zeros to 4 digits." },
        { kind: "call", call: "booking_code(12, 2026, 3)", expect: "R12-2026-0003" },
        { kind: "call", call: "booking_code(101, 2025, 1234)", expect: "R101-2025-1234" },
      ],
      hints: [
        "Build it with one f-string.",
        "The format spec `04d` means: whole number, at least 4 characters, fill with zeros.",
        '```python\ndef booking_code(room, year, number):\n    return f"R{room}-{year}-{number:04d}"\n```',
      ],
      solution: {
        code: `def booking_code(room, year, number):
    return f"R{room}-{year}-{number:04d}"
`,
        explanation: "`42` with `:04d` → `0042`. Fixed-width codes sort nicely in spreadsheets and are easy to read out on the phone.",
      },
      wrongAnswers: [`def booking_code(room, year, number):\n    return f"R{room}-{year}-{number}"\n`, `def booking_code(room, year, number):\n    return f"R{room}-{year}-00{number}"\n`],
    },
  ],
  quiz: [
    {
      id: "slice-string",
      kind: "predict",
      question: "What does this print?",
      code: `name = "Motel Sol"
print(name[:5], name[-3:], len(name))
`,
      options: ["Motel Sol 9", "Motel  Sol 9", "Motel Sol 8", "Mote Sol 9"],
      answer: 0,
      explanation: "`[:5]` is the first 5 characters (`Motel`), `[-3:]` the last 3 (`Sol`). The space counts too, so the length is 9.",
    },
    {
      id: "immutable",
      kind: "predict",
      question: "What does this print?",
      code: `city = "cancun"
city.upper()
print(city)
`,
      options: ["CANCUN", "cancun", "Cancun", "None"],
      answer: 1,
      explanation: "`city.upper()` returns a new string, but it's not stored anywhere. `city` itself never changes. Use `city = city.upper()`.",
    },
    {
      id: "split-list",
      kind: "predict",
      question: "What does this print?",
      code: `print("2025-03-15".split("-"))`,
      options: ["[2025, 3, 15]", "['2025', '03', '15']", "2025 03 15", "['2025-03-15']"],
      answer: 1,
      explanation: "`split` returns a list of **strings**. The quotes show they're still text, so `'03'` keeps its leading zero.",
    },
  ],
});
