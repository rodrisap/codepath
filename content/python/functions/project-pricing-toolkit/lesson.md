## Brief

Remember the seasonal rate rules from Module 5? That code worked, but you couldn't reuse it. Now you'll turn it into a small **pricing toolkit**: functions that the rest of the motel's software (and the capstone) can call.

| Function | Returns |
|---|---|
| `season_rate(month)` | 750 (Dec–Jan), 600 (Jun–Aug), otherwise 450 |
| `stay_price(nights, month, guests=2)` | total price: +150 per extra guest per night, 10% off for 7+ nights, rounded to 2 decimals |
| `format_mxn(amount)` | text like `"12,345.50 MXN"` |
| `quote_text(guest, nights, month, guests=2)` | `"Ana: 8 nights in month 7 = 5,400.00 MXN"` |

The key idea: **functions calling functions**. `stay_price` uses `season_rate`, and `quote_text` uses both `stay_price` and `format_mxn`. Each function does one small job and can be tested on its own.
