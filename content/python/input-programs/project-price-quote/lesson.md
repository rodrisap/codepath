## Brief

Guests often call to ask "how much would it cost?". Build a **quote tool** the receptionist can run during the call. It asks four questions and prints a complete quote:

```text
Guest name: Ana
Nights: 3
Adults: 2
Rate per night: 650
--- Quote for Ana ---
Room: 1950.00 MXN
Breakfast: 570.00 MXN
VAT (16%): 403.20 MXN
Total: 2923.20 MXN (135.96 EUR)
Deposit to confirm (30%): 876.96 MXN
```

Rules:

- Breakfast costs **95 MXN per adult per night**.
- VAT is **16%** on room + breakfast.
- Euros at **21.5 MXN per euro**.
- A **30% deposit** confirms the booking.

The rate can have decimals (e.g. `480.50`).
