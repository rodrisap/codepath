## Concept

Types decide what you can do with a value. `"450"` (text) and `450` (number) look alike, but only the number can be used in a calculation. Data from forms, spreadsheets and `input()` often arrives as text, so you **convert** it:

| Conversion | Result |
|---|---|
| `int("450")` | `450` |
| `float("12.5")` | `12.5` |
| `str(7)` | `"7"` |

It's like changing money at the airport: you have the right amount, but in the wrong "currency" (type) for what you want to do, so you exchange it first.

**f-strings** build text from values. Put an `f` before the quote and variables inside `{ }`:

```python
f"Room {room}: {nights} nights"
```

Add a format after a colon: `{total:.2f}` shows 2 decimals, `{total:,.2f}` also adds thousands separators. It works like a mail-merge template: the placeholders are filled in when the line runs.

## How it runs

Line 3 converts the text `"450"` into the number `450`, so line 4 can multiply. Line 5 goes the other way: `str(7)` turns the number into text so it can be glued to `"Room "` with `+`. The f-strings on lines 8–11 fill in each `{…}` with the current value, and `:.2f` rounds the *display* to 2 decimals. The value in the variable stays unchanged.

## Common mistakes

**1. Calculating with text.** `"4" * 500` doesn't crash. It repeats the text `"4"` 500 times! And `"450" + 50` crashes:

```text
TypeError: can only concatenate str (not "int") to str
```

Both mean the same thing: convert first, with `int(...)` or `float(...)`.

**2. `int()` on a decimal text.** `int("12.5")` fails with `ValueError: invalid literal for int() with base 10: '12.5'`. Use `float("12.5")`, or `int(float("12.5"))` if you really want 12.

**3. Forgetting the `f`.** `"Total: {total}"` prints the braces literally. It must be `f"Total: {total}"`.
