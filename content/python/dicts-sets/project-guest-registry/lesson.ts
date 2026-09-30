import { defineLesson } from "../../../../src/content/types";

const DATA = `stays = [
    {"guest": "Ana Lopez", "country": "Mexico", "nights": 3, "total": 1350},
    {"guest": "John Smith", "country": "USA", "nights": 2, "total": 1100},
    {"guest": "Ana Lopez", "country": "Mexico", "nights": 1, "total": 450},
    {"guest": "Emma Brown", "country": "Canada", "nights": 5, "total": 2750},
    {"guest": "John Smith", "country": "USA", "nights": 4, "total": 2000},
    {"guest": "Lena Vogel", "country": "Germany", "nights": 2, "total": 1040},
    {"guest": "Ana Lopez", "country": "Mexico", "nights": 2, "total": 900},
]
`;

const BUILD = `registry = {}
for stay in stays:
    name = stay["guest"]
    if name not in registry:
        registry[name] = {"visits": 0, "nights": 0, "spent": 0}
    entry = registry[name]
    entry["visits"] = entry["visits"] + 1
    entry["nights"] = entry["nights"] + stay["nights"]
    entry["spent"] = entry["spent"] + stay["total"]
`;

const REPORT = `countries = set()
total_nights = 0
for stay in stays:
    countries.add(stay["country"])
    total_nights = total_nights + stay["nights"]

top_name = ""
top_spent = 0
repeat = []
for name, entry in registry.items():
    if entry["spent"] > top_spent:
        top_spent = entry["spent"]
        top_name = name
    if entry["visits"] > 1:
        repeat.append(name)

print(f"Guests: {len(registry)} from {len(countries)} countries")
print(f"Top spender: {top_name} ({top_spent} MXN)")
print(f"Repeat guests: {sorted(repeat)}")
print(f"Average stay: {total_nights / len(stays):.1f} nights")
`;

export default defineLesson({
  goal: "Turn a list of records into a dict of dicts, and answer business questions from it.",
  exercises: [
    {
      id: "build",
      title: "Step 1: build the registry",
      prompt:
        "Loop over `stays` and build `registry`: a dict with one entry per guest name, each holding a dict with `\"visits\"`, `\"nights\"` and `\"spent\"`.",
      starter: DATA + "\nregistry = {}\n# loop over the stays\n",
      tests: [
        {
          kind: "var",
          variable: "registry",
          expect: {
            "Ana Lopez": { visits: 3, nights: 6, spent: 2700 },
            "John Smith": { visits: 2, nights: 6, spent: 3100 },
            "Emma Brown": { visits: 1, nights: 5, spent: 2750 },
            "Lena Vogel": { visits: 1, nights: 2, spent: 1040 },
          },
          hint: "The first time you see a guest, create their entry with zeros; then always add to it.",
        },
      ],
      hints: [
        "For each stay: `if name not in registry:` create `{\"visits\": 0, \"nights\": 0, \"spent\": 0}`.",
        "Then update that guest's inner dict: `registry[name][\"visits\"] += 1`, and so on.",
        "Tip: `entry = registry[name]` gives a short name for the inner dict. Changing `entry` changes the registry, because both names point to the same dict.",
      ],
      solution: {
        code: DATA + "\n" + BUILD,
        explanation:
          "Ana appears three times: the first time her entry is created with zeros, and each stay adds to it → visits 3, nights 3+1+2 = 6, spent 1350+450+900 = 2700. `entry` is not a copy: it's another name for the same inner dict (trace it and watch `registry` change).",
      },
      wrongAnswers: [
        DATA + "\n" + BUILD.replace('    if name not in registry:\n        registry[name] = {"visits": 0, "nights": 0, "spent": 0}\n', '    registry[name] = {"visits": 0, "nights": 0, "spent": 0}\n'),
        DATA + "\n" + BUILD.replace('entry["nights"] + stay["nights"]', 'stay["nights"]'),
      ],
    },
    {
      id: "report",
      title: "Step 2: the loyalty report",
      prompt: "Using `stays` and `registry`, print the four report lines from the brief. The top spender is the guest with the highest `spent`; repeat guests have more than 1 visit (print them sorted). Average stay = all nights ÷ number of stays.",
      starter: DATA + "\n" + BUILD + "\n# the report\n",
      tests: [
        {
          kind: "output",
          label: "The report",
          expect: "Guests: 4 from 4 countries\nTop spender: John Smith (3100 MXN)\nRepeat guests: ['Ana Lopez', 'John Smith']\nAverage stay: 2.7 nights",
          hint: "Countries: collect them in a set. The average is per *stay* (7 stays), not per guest.",
        },
      ],
      hints: [
        "Countries: loop over `stays` and `.add` each country to a set. Count the nights in the same loop.",
        "Loop over `registry.items()` to find the top spender (best-so-far pattern) and the repeat guests (visits > 1).",
        "Average: `total_nights / len(stays)` → 19 / 7 → 2.714…, shown with `:.1f`.",
      ],
      solution: {
        code: DATA + "\n" + BUILD + "\n" + REPORT,
        explanation:
          "Stays are the rows; the registry is a summary per guest. Different questions need different views: the average stay is per *stay* (19 nights / 7 stays = 2.7), while \"top spender\" needs the per-guest totals (John: 1100 + 2000 = 3100).",
      },
      wrongAnswers: [
        DATA + "\n" + BUILD + "\n" + REPORT.replace("total_nights / len(stays)", "total_nights / len(registry)"),
        DATA + "\n" + BUILD + "\n" + REPORT.replace('if entry["visits"] > 1:', 'if entry["visits"] >= 1:'),
      ],
    },
  ],
  quiz: [],
});
