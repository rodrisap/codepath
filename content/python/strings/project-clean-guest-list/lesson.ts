import { defineLesson } from "../../../../src/content/types";

const RAW = `raw_rows = [
    "  ana lopez ; mx ; 3 ; 1.350,00",
    "JOHN SMITH;us;1;980,5",
    " ; mx ; 2 ; 900,00",
    "lena vogel ;DE; 2 ; 1.040",
    "carlos mendez;MX;three;2.341,50",
    "emma brown ; ca ; 5 ; 2.750,00",
    "luis garcia;mx;1;480",
]
`;

const CLEAN = `guests = []
skipped = 0
for row in raw_rows:
    name, country, nights, amount = row.split(";")
    name = name.strip().title()
    nights = nights.strip()
    if name == "" or not nights.isdigit():
        skipped = skipped + 1
        continue
    guests.append({
        "name": name,
        "country": country.strip().upper(),
        "nights": int(nights),
        "amount": float(amount.strip().replace(".", "").replace(",", ".")),
    })
`;

const REPORT = `print(f"{'Name':<13}{'Ctry':<5}{'Nights':>6}{'Amount':>11}")
per_country = {}
total = 0
for g in guests:
    print(f"{g['name']:<13}{g['country']:<5}{g['nights']:>6}{g['amount']:>11.2f}")
    per_country[g["country"]] = per_country.get(g["country"], 0) + 1
    total = total + g["amount"]
print(f"Guests per country: {per_country}")
print(f"Total: {total:.2f} MXN ({skipped} rows skipped)")
`;

const TABLE = `Name         Ctry Nights     Amount
Ana Lopez    MX        3    1350.00
John Smith   US        1     980.50
Lena Vogel   DE        2    1040.00
Emma Brown   CA        5    2750.00
Luis Garcia  MX        1     480.00
Guests per country: {'MX': 2, 'US': 1, 'DE': 1, 'CA': 1}
Total: 6600.50 MXN (2 rows skipped)`;

export default defineLesson({
  goal: "Clean a messy real-world dataset, skip invalid rows safely, and produce an aligned report.",
  exercises: [
    {
      id: "clean",
      title: "Step 1: clean and validate",
      prompt:
        "Build `guests`: a list of dicts (keys `name`, `country`, `nights`, `amount`) for every **valid** row, and count the invalid ones in `skipped`. A row is invalid if the cleaned name is empty or the nights aren't all digits.",
      starter: RAW + "\nguests = []\nskipped = 0\n# loop over raw_rows\n",
      tests: [
        {
          kind: "var",
          variable: "guests",
          expect: [
            { name: "Ana Lopez", country: "MX", nights: 3, amount: 1350.0 },
            { name: "John Smith", country: "US", nights: 1, amount: 980.5 },
            { name: "Lena Vogel", country: "DE", nights: 2, amount: 1040.0 },
            { name: "Emma Brown", country: "CA", nights: 5, amount: 2750.0 },
            { name: "Luis Garcia", country: "MX", nights: 1, amount: 480.0 },
          ],
          hint: 'Check validity *before* converting: `int("three")` would crash.',
        },
        { kind: "var", variable: "skipped", expect: 2 },
      ],
      hints: [
        'Split and strip first. Then check `if name == "" or not nights.isdigit():` and `continue`.',
        "Only valid rows reach the `append`. Convert nights with `int()`, and the amount the European way.",
        "Use the parse_row logic from the previous lesson, with the validity check added before the conversions.",
      ],
      solution: {
        code: RAW + "\n" + CLEAN,
        explanation:
          'Row 3\'s name is empty after `strip()` and row 5 has `"three"`, so both hit `continue` and `skipped` becomes 2. Checking *before* converting is the key: `int("three")` would crash the whole import.',
      },
      wrongAnswers: [
        RAW + "\n" + CLEAN.replace('if name == "" or not nights.isdigit():', 'if name == "":'),
        RAW + "\n" + CLEAN.replace('.replace(".", "").replace(",", ".")', '.replace(",", ".")'),
      ],
    },
    {
      id: "report",
      title: "Step 2: the report",
      prompt:
        "Print the table exactly as in the brief (column widths 13, 5, 6 and 11; headings too), then the guests-per-country dict and the total line.",
      starter: RAW + "\n" + CLEAN + "\n# print the report\n",
      tests: [
        {
          kind: "output",
          label: "The report matches line by line",
          expect: TABLE,
          hint: "Widths: `{name:<13}{country:<5}{nights:>6}{amount:>11.2f}`. Text is left-aligned, numbers right-aligned.",
        },
      ],
      hints: [
        "Header: `f\"{'Name':<13}{'Ctry':<5}{'Nights':>6}{'Amount':>11}\"`.",
        "Inside the loop, one row per guest with the same widths, plus `.2f` for the amount. Count countries with `.get(key, 0) + 1`.",
        'After the loop print the dict and `f"Total: {total:.2f} MXN ({skipped} rows skipped)"`.',
      ],
      solution: {
        code: RAW + "\n" + CLEAN + "\n" + REPORT,
        explanation:
          "Fixed widths make the columns line up whatever the name length: `'Ana Lopez':<13` pads to 13 characters. Numbers are right-aligned so the decimal points line up, which is how accountants read columns.",
      },
      wrongAnswers: [RAW + "\n" + CLEAN + "\n" + REPORT.replace("{g['amount']:>11.2f}", "{g['amount']:>11}")],
    },
  ],
  quiz: [],
});
