## Brief

The motel's online form sends every booking as **text**, even the numbers. You need to turn the raw form data into a clean booking card for the front desk:

```text
+------------------------------+
| BOOKING #1042
| Guest:  Carlos Mendez
| Room:   12
| Nights: 3 x 780.50 MXN
| Total:  2341.50 MXN
| In EUR: 108.91 EUR
+------------------------------+
```

You'll need **conversion** (text → numbers), **variables** for every intermediate result, and **f-strings** with `:.2f` for money. The exchange rate is 21.5 MXN per euro.
