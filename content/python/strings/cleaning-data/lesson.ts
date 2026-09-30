import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Clean messy text data: split fields, strip spaces, fix capitals and convert different number formats.",
  example: {
    intro: "Three rows exported from a European booking site: `name ; country ; amount`, with messy spacing and European number formats.",
    code: `rows = ["  Ana Lopez ; mx ; 1.350,00 ",
        "JOHN SMITH;us;980,5",
        "lena vogel ;DE; 2.100 "]
total = 0
for row in rows:
    name, country, amount = row.split(";")
    name = name.strip().title()
    country = country.strip().upper()
    amount = float(amount.strip().replace(".", "").replace(",", "."))
    print(f"{name:<12}{country:<4}{amount:>9.2f}")
    total = total + amount
print(f"{'TOTAL':<16}{total:>9.2f}")
`,
  },
  tryIt: { prompt: "Swap the two `.replace(...)` calls on line 9 and run it. What happens to Ana's amount, and why? Then add a fourth messy row of your own." },
  exercises: [
    {
      id: "parse-mxn",
      title: "Parse a peso amount",
      prompt:
        'Write `parse_mxn(text)` that turns amounts like `"$1,234.50"`, `" 980 MXN "` or `"1234.5"` into a float. Remove `$`, `MXN`, thousands commas and spaces.',
      starter: `def parse_mxn(text):
    pass
`,
      tests: [
        { kind: "call", call: 'parse_mxn("$1,234.50")', expect: 1234.5 },
        { kind: "call", call: 'parse_mxn(" 980 MXN ")', expect: 980.0 },
        { kind: "call", call: 'parse_mxn("1234.5")', expect: 1234.5 },
        { kind: "call", call: 'parse_mxn("$12,500")', expect: 12500.0, hint: "Here the comma is a thousands separator: remove it." },
      ],
      hints: [
        "Chain `.replace(...)` calls to delete each unwanted piece (replace it with `\"\"`).",
        'Remove `"$"`, `"MXN"` and `","`, then `.strip()` the spaces, then `float(...)`.',
        '```python\ndef parse_mxn(text):\n    clean = text.replace("$", "").replace("MXN", "").replace(",", "").strip()\n    return float(clean)\n```',
      ],
      solution: {
        code: `def parse_mxn(text):
    clean = text.replace("$", "").replace("MXN", "").replace(",", "").strip()
    return float(clean)
`,
        explanation: '`"$1,234.50"` → remove `$` → `"1,234.50"` → remove `,` → `"1234.50"` → `float` → 1234.5. Each `.replace` returns a new string for the next step.',
      },
      wrongAnswers: [
        `def parse_mxn(text):\n    clean = text.replace("$", "").replace("MXN", "").replace(",", ".").strip()\n    return float(clean)\n`,
        `def parse_mxn(text):\n    return float(text.replace("$", "").replace(",", "").strip())\n`,
      ],
    },
    {
      id: "phone",
      title: "Normalise phone numbers",
      prompt:
        'Write `normalize_phone(text)` for Mexican numbers. Keep only the digits; if there are 12 digits starting with `52`, drop the `52`. With exactly 10 digits, return `"+52 55 1234 5678"` (2-4-4 groups); otherwise return `"invalid"`.',
      starter: `def normalize_phone(text):
    digits = ""
    # keep only the digits
    pass
`,
      tests: [
        { kind: "call", call: 'normalize_phone("55-1234-5678")', expect: "+52 55 1234 5678" },
        { kind: "call", call: 'normalize_phone("(55) 1234 5678")', expect: "+52 55 1234 5678" },
        { kind: "call", call: 'normalize_phone("+52 998 123 4567")', expect: "+52 99 8123 4567", hint: "12 digits starting with 52: drop the first two, then format the remaining 10." },
        { kind: "call", call: 'normalize_phone("12345")', expect: "invalid" },
      ],
      hints: [
        "Loop over the characters: `for ch in text:` and keep those where `ch.isdigit()`.",
        "`if len(digits) == 12 and digits.startswith(\"52\"): digits = digits[2:]`",
        'Format with slices: `f"+52 {digits[:2]} {digits[2:6]} {digits[6:]}"`.',
      ],
      solution: {
        code: `def normalize_phone(text):
    digits = ""
    for ch in text:
        if ch.isdigit():
            digits = digits + ch
    if len(digits) == 12 and digits.startswith("52"):
        digits = digits[2:]
    if len(digits) != 10:
        return "invalid"
    return f"+52 {digits[:2]} {digits[2:6]} {digits[6:]}"
`,
        explanation:
          '`"+52 998 123 4567"` → digits `"529981234567"` (12) → drop `52` → `"9981234567"` → slices `99`, `8123`, `4567`. One consistent format makes duplicates easy to spot and numbers easy to dial.',
      },
      wrongAnswers: [
        `def normalize_phone(text):\n    digits = text.replace("-", "").replace(" ", "")\n    if len(digits) != 10:\n        return "invalid"\n    return f"+52 {digits[:2]} {digits[2:6]} {digits[6:]}"\n`,
        `def normalize_phone(text):\n    digits = ""\n    for ch in text:\n        if ch.isdigit():\n            digits = digits + ch\n    if len(digits) != 10:\n        return "invalid"\n    return f"+52 {digits[:2]} {digits[2:6]} {digits[6:]}"\n`,
      ],
    },
    {
      id: "parse-row",
      title: "Parse a whole row",
      prompt:
        'Write `parse_row(row)` for rows like `"  ana lopez ; mx ; 3 ; 1.350,00"` (name ; country ; nights ; European amount). Return a dict: `{"name": "Ana Lopez", "country": "MX", "nights": 3, "amount": 1350.0}`.',
      starter: `def parse_row(row):
    pass
`,
      tests: [
        { kind: "call", call: 'parse_row("  ana lopez ; mx ; 3 ; 1.350,00")', expect: { name: "Ana Lopez", country: "MX", nights: 3, amount: 1350.0 } },
        { kind: "call", call: 'parse_row("JOHN SMITH;us;1;980,5")', expect: { name: "John Smith", country: "US", nights: 1, amount: 980.5 } },
        { kind: "call", call: 'parse_row("lena vogel ;DE; 12 ; 12.100,75 ")', expect: { name: "Lena Vogel", country: "DE", nights: 12, amount: 12100.75 }, hint: "Remove the dot (thousands) before turning the comma into a point." },
      ],
      hints: [
        'Unpack: `name, country, nights, amount = row.split(";")`.',
        'Clean each: `.strip().title()`, `.strip().upper()`, `int(nights.strip())`, and for the amount `.replace(".", "").replace(",", ".")`.',
        "Return the dict with the four cleaned values.",
      ],
      solution: {
        code: `def parse_row(row):
    name, country, nights, amount = row.split(";")
    return {
        "name": name.strip().title(),
        "country": country.strip().upper(),
        "nights": int(nights.strip()),
        "amount": float(amount.strip().replace(".", "").replace(",", ".")),
    }
`,
        explanation: '`"12.100,75"` → remove `.` → `"12100,75"` → `,` to `.` → `"12100.75"` → 12100.75. A function that turns one messy row into one clean dict can then be used on thousands of rows with a simple loop.',
      },
      wrongAnswers: [
        `def parse_row(row):\n    name, country, nights, amount = row.split(";")\n    return {\n        "name": name.strip().title(),\n        "country": country.strip().upper(),\n        "nights": int(nights.strip()),\n        "amount": float(amount.strip().replace(",", ".").replace(".", "")),\n    }\n`,
        `def parse_row(row):\n    name, country, nights, amount = row.split(";")\n    return {\n        "name": name.strip().title(),\n        "country": country.strip(),\n        "nights": int(nights.strip()),\n        "amount": float(amount.strip().replace(".", "").replace(",", ".")),\n    }\n`,
      ],
    },
  ],
  quiz: [
    {
      id: "strip-inner",
      kind: "predict",
      question: "What does this print?",
      code: `print("[" + "  Motel   Sol  ".strip() + "]")`,
      options: ["[Motel Sol]", "[Motel   Sol]", "[  Motel   Sol  ]", "[MotelSol]"],
      answer: 1,
      explanation: "`strip()` only removes spaces at the **start and end**. The spaces in the middle stay.",
    },
    {
      id: "euro-format",
      kind: "predict",
      question: "What does this print?",
      code: `text = "2.450,50"
print(float(text.replace(".", "").replace(",", ".")))
`,
      options: ["2.45", "2450.5", "245050.0", "ValueError"],
      answer: 1,
      explanation: "Remove the dot → `\"2450,50\"`; comma to point → `\"2450.50\"`; float → 2450.5.",
    },
    {
      id: "isdigit",
      kind: "predict",
      question: "What does this print?",
      code: `print("450".isdigit(), "45.0".isdigit(), " 45".isdigit())`,
      options: ["True True True", "True False False", "True False True", "False False False"],
      answer: 1,
      explanation: "`isdigit()` is True only if *every* character is a digit. The dot and the space make the other two False.",
    },
  ],
});
