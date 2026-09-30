import { defineLesson } from "../../../../src/content/types";

const SEASON = `def season_rate(month):
    """Nightly rate for a month (1-12)."""
    if month == 12 or month == 1:
        return 750
    elif 6 <= month <= 8:
        return 600
    return 450
`;

const PRICE = `def stay_price(nights, month, guests=2):
    """Total price of a stay, including extra guests and the weekly discount."""
    extra = 0
    if guests > 2:
        extra = (guests - 2) * 150
    total = nights * (season_rate(month) + extra)
    if nights >= 7:
        total = total * 0.9
    return round(total, 2)
`;

const FORMAT = `def format_mxn(amount):
    """12345.5 -> '12,345.50 MXN'"""
    return f"{amount:,.2f} MXN"
`;

const QUOTE = `def quote_text(guest, nights, month, guests=2):
    """One-line quote for a guest."""
    price = stay_price(nights, month, guests)
    return f"{guest}: {nights} nights in month {month} = {format_mxn(price)}"
`;

export default defineLesson({
  goal: "Split a real calculation into small functions that call each other and can each be tested.",
  exercises: [
    {
      id: "season-rate",
      title: "Step 1: season_rate(month)",
      prompt: "Write `season_rate(month)` that **returns** 750 for December and January, 600 for June–August, and 450 otherwise.",
      starter: `def season_rate(month):
    pass
`,
      tests: [
        { kind: "call", call: "season_rate(12)", expect: 750 },
        { kind: "call", call: "season_rate(1)", expect: 750 },
        { kind: "call", call: "season_rate(6)", expect: 600 },
        { kind: "call", call: "season_rate(8)", expect: 600 },
        { kind: "call", call: "season_rate(5)", expect: 450 },
        { kind: "call", call: "season_rate(9)", expect: 450 },
      ],
      hints: [
        "Same rules as the Module 5 project, but `return` the rate instead of storing it.",
        "Once a `return` runs, the function ends, so you don't even need `else` for the last case.",
        "```python\ndef season_rate(month):\n    if month == 12 or month == 1:\n        return 750\n    elif 6 <= month <= 8:\n        return 600\n    return 450\n```",
      ],
      solution: { code: SEASON, explanation: "Each `return` ends the function, so `return 450` at the bottom is only reached when neither condition matched." },
      wrongAnswers: [SEASON.replace("6 <= month <= 8", "6 < month <= 8"), SEASON.replace("return 450", "return 600")],
    },
    {
      id: "stay-price",
      title: "Step 2: stay_price(...)",
      prompt: "Write `stay_price(nights, month, guests=2)` using `season_rate`. Extra guests (above 2) add 150 per night each; 7 or more nights get 10% off. Return the total rounded to 2 decimals.",
      starter: SEASON + "\n\ndef stay_price(nights, month, guests=2):\n    pass\n",
      tests: [
        { kind: "call", call: "stay_price(2, 1)", expect: 1500 },
        { kind: "call", call: "stay_price(8, 7, 3)", expect: 5400.0, hint: "Summer 600 + one extra guest 150 = 750 per night; 8 nights = 6000; 10% off." },
        { kind: "call", call: "stay_price(7, 4, 4)", expect: 4725.0, hint: "7 nights exactly also gets the discount." },
        { kind: "call", call: "stay_price(3, 10, guests=1)", expect: 1350 },
        { kind: "source", label: "Uses season_rate", pattern: "season_rate\\(month\\)", message: "Call `season_rate(month)` instead of repeating the season rules." },
      ],
      hints: [
        "Start with `rate = season_rate(month)`: reuse, don't rewrite.",
        "Extra per night: `(guests - 2) * 150` if `guests > 2`. Total: `nights * (rate + extra)`.",
        "Then `if nights >= 7: total = total * 0.9`, and `return round(total, 2)`.",
      ],
      solution: { code: SEASON + "\n\n" + PRICE, explanation: "`stay_price(8, 7, 3)`: `season_rate(7)` → 600, extra 150, 8 × 750 = 6000, × 0.9 → 5400.0. If the seasons ever change, only `season_rate` needs editing." },
      wrongAnswers: [SEASON + "\n\n" + PRICE.replace("if nights >= 7:", "if nights > 7:"), SEASON + "\n\n" + PRICE.replace("nights * (season_rate(month) + extra)", "nights * season_rate(month) + extra")],
    },
    {
      id: "format-and-quote",
      title: "Step 3: format_mxn and quote_text",
      prompt:
        "Write `format_mxn(amount)` returning text like `\"12,345.50 MXN\"` (thousands separator, 2 decimals), and `quote_text(guest, nights, month, guests=2)` returning e.g. `\"Ana: 8 nights in month 7 = 5,400.00 MXN\"`.",
      starter: SEASON + "\n\n" + PRICE + "\n\ndef format_mxn(amount):\n    pass\n\n\ndef quote_text(guest, nights, month, guests=2):\n    pass\n",
      tests: [
        { kind: "call", call: "format_mxn(12345.5)", expect: "12,345.50 MXN", hint: 'The format spec `:,.2f` adds the comma and 2 decimals.' },
        { kind: "call", call: "format_mxn(0)", expect: "0.00 MXN" },
        { kind: "call", call: 'quote_text("Ana", 8, 7, 3)', expect: "Ana: 8 nights in month 7 = 5,400.00 MXN" },
        { kind: "call", call: 'quote_text("Luis", 2, 12)', expect: "Luis: 2 nights in month 12 = 1,500.00 MXN" },
        { kind: "source", label: "quote_text reuses the other functions", pattern: "stay_price\\([\\s\\S]*format_mxn\\(|format_mxn\\([\\s\\S]*stay_price\\(", message: "Build the quote by calling `stay_price` and `format_mxn`." },
      ],
      hints: [
        '`format_mxn` is one line: `return f"{amount:,.2f} MXN"`.',
        "In `quote_text`, first get the price with `stay_price(nights, month, guests)`.",
        '`return f"{guest}: {nights} nights in month {month} = {format_mxn(price)}"`',
      ],
      solution: {
        code: SEASON + "\n\n" + PRICE + "\n\n" + FORMAT + "\n\n" + QUOTE,
        explanation:
          "`quote_text` → calls `stay_price` → which calls `season_rate`. Three levels deep, yet each function is short and easy to check on its own. Trace a call like `print(quote_text(\"Ana\", 8, 7, 3))` in the playground to watch the calls nest.",
      },
      wrongAnswers: [
        SEASON + "\n\n" + PRICE + "\n\n" + FORMAT.replace(":,.2f", ":.2f") + "\n\n" + QUOTE,
        SEASON + "\n\n" + PRICE + "\n\n" + FORMAT + "\n\n" + QUOTE.replace("price = stay_price(nights, month, guests)", "price = stay_price(nights, month)"),
      ],
    },
  ],
  quiz: [],
});
