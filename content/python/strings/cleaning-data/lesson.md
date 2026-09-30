## Concept

Real data is messy. Exports from booking sites, handwritten forms typed in later, and spreadsheets from suppliers all bring extra spaces, random capitals, currency signs and different number formats:

```text
"  ana LOPEZ ; mx ; 1.350,00 "
```

Cleaning is like washing vegetables before cooking. It's boring, but everything after it goes wrong if you skip it. The recipe is always the same:

1. **Split** the line into fields (`.split(";")`).
2. **Strip** every field (`.strip()`).
3. **Normalise** the text (`.title()`, `.upper()`, `.lower()`).
4. **Convert** numbers, after removing symbols with `.replace(...)`.

**Watch the number format.** In Mexico and the US, `1,350.00` uses a comma for thousands. In the Netherlands and much of Europe it's written `1.350,00`. To convert `"1.350,00"`: remove the dots, then turn the comma into a point → `"1350.00"` → `float(...)`.

`text.isdigit()` tells you whether a string contains only digits. It's handy for checking before `int()`.

## How it runs

Each round, line 6 splits one messy row into three pieces and unpacks them. Lines 7–9 clean each piece. Watch `amount` in the trace: `' 1.350,00 '` → strip → remove the dot → comma to point → `1350.0`. The f-string on line 10 pads the columns so the output lines up.

## Common mistakes

**1. Converting before cleaning.** `float(" 1.350,00")` fails with `ValueError: could not convert string to float: ' 1.350,00'`. The message shows the exact text in quotes. Look at it carefully: here it's the comma and the dot.

**2. Replacing in the wrong order.** With `"1.350,00"`, turning the comma into a point *first* gives `"1.350.00"`, and removing the dots then gives `"135000"`: 100 times too much! Remove the thousands separator first.

**3. Splitting on the wrong character.** If the file uses `;` and you split on `,`, you get one long field, and unpacking fails with `ValueError: not enough values to unpack (expected 3, got 1)`.
