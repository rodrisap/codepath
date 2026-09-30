## Concept

Most business maths is a few patterns:

| Task | Pattern | Example (price 1000) |
|---|---|---|
| Add 16% VAT (IVA) | `price * 1.16` | 1160.0 |
| 10% discount | `price * (1 - 0.10)` | 900.0 |
| VAT inside a gross price | `gross / 1.16` → net | 1160 → 1000.0 |
| MXN → EUR | `mxn / mxn_per_eur` | 1000 / 21.5 → 46.51… |

**Floats are not exact.** Computers store decimals in binary, so `0.1 + 0.2` gives `0.30000000000000004`. It's like measuring with a ruler that is off by a hair: fine for maths, but you still write the receipt to the cent. Two tools:

- `round(x, 2)` changes the **value** to 2 decimals.
- `f"{x:.2f}"` only changes the **display**.

A good habit: keep full precision while calculating, and round when you store a final money amount or show it.

## How it runs

Watch the trace for lines 5–8: every intermediate result gets its own variable, so you can check each step. The discount is applied before VAT, which is the usual order on an invoice. Notice the raw float values in the Variables column (e.g. `337.176`). Only the printed lines are rounded.

## Common mistakes

**1. Adding a percentage as a number.** `price + 16` adds 16 pesos, not 16%. Use `price * 1.16`, or `price + price * 0.16`.

**2. Removing VAT by subtracting 16%.** From a gross price of 1160, `1160 * 0.84` gives 974.4, which is wrong. The VAT was 16% *of the net*, so divide: `1160 / 1.16` → 1000.0.

**3. Surprised by `round()`.** Python rounds halves to the nearest *even* number: `round(2.5)` is `2`, `round(3.5)` is `4`. And `round(0.125, 2)` gives `0.12` because 0.125 isn't stored exactly. For everyday invoices this rarely matters. Accounting software uses a special `Decimal` type when every cent must follow strict rules.
