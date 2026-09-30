## Brief

A booking site sent last week's guests as raw text rows: `name ; country ; nights ; amount`, with European number formats. Some rows are broken: one has no name, another says `three` instead of `3`. Your job:

1. **Clean** every valid row into a dict, and **skip** broken rows (empty name, or nights that aren't digits), counting how many you skipped.
2. **Report** it as a neat table with totals:

```text
Name         Ctry Nights     Amount
Ana Lopez    MX        3    1350.00
John Smith   US        1     980.50
Lena Vogel   DE        2    1040.00
Emma Brown   CA        5    2750.00
Luis Garcia  MX        1     480.00
Guests per country: {'MX': 2, 'US': 1, 'DE': 1, 'CA': 1}
Total: 6600.50 MXN (2 rows skipped)
```

This is exactly what you'd do before importing outside data into your accounting sheet. You clean it first, and you never silently lose rows: you count what you skipped.
