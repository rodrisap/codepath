## Concept

Strings come with **methods**: small built-in tools you call with a dot:

| Method | `"  ana LOPEZ "` → |
|---|---|
| `.strip()` | `"ana LOPEZ"` (removes outer spaces) |
| `.lower()` / `.upper()` | `"  ana lopez "` / `"  ANA LOPEZ "` |
| `.title()` | `"  Ana Lopez "` |
| `.replace("a", "o")` | `"  ono LOPEZ "` |
| `.split(" ")` | a **list** of pieces |
| `.startswith("x")` | `True` / `False` |
| `"-".join(list)` | glues a list of strings together |

Strings also work like lists: `name[0]` is the first letter, `name[:3]` the first three, `len(name)` the length.

**Strings never change.** Methods return a *new* string, so you must store the result: `name = name.strip()`. Like a photocopier: it hands you an edited copy, and the original page stays as it was.

f-strings can **align** text for tables: `{text:<10}` pads to 10 characters, left-aligned; `{number:>8}` is right-aligned; `{n:04d}` pads a number with zeros (`0042`).

## How it runs

Line 2 chains two methods: `raw.strip()` makes a new string, and `.title()` works on *that* result. `split("-")` on line 5 turns one string into a list of three strings, so `parts[1]` is `'2025'`. It's still text, not a number. The last two lines use padding to line up a small table.

## Common mistakes

**1. Not storing the result.**

```python
name = "  ana "
name.strip()        # makes a new string... and throws it away
print(name)         # still "  ana "
```

Write `name = name.strip()`.

**2. Calling a method on a number.** `450.upper()` makes no sense, and `rate.strip()` on an int gives `AttributeError: 'int' object has no attribute 'strip'`. Check the type.

**3. Forgetting that `split` gives strings.** `"3-450".split("-")` is `['3', '450']`. Convert with `int()` before calculating.
