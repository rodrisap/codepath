## Brief

March's expenses for Motel Sol are stored as a list of `(date, category, amount)` tuples, just like the rows of your accounting sheet. Build two tools on top of it:

1. **A category lookup.** The user types a category and sees how many expenses it had and their total.
2. **A month report:**

```text
Total: 9340.00 MXN
Biggest: 2025-03-05 electricity 2350 MXN
Over 1000 MXN: 4 expenses
Share of laundry: 23.0%
```

Use loops and accumulators (no `sum`, `max` or `len` yet: you'll meet those shortcuts in module 14).
