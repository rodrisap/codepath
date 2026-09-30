## Concept

Programs need to make decisions. `if` runs a block of code **only when a condition is True**, and `else` runs when it's False:

```python
if nights >= 7:
    print("Weekly discount!")
else:
    print("Standard rate")
```

It's a front-desk rule written down: *"If the guest stays a week or longer, give 10% off. Otherwise, charge the normal price."*

A **condition** is a comparison that gives `True` or `False` (a `bool`):

| Operator | Meaning | `nights = 7` |
|---|---|---|
| `==` | equal to | `nights == 7` → True |
| `!=` | not equal | `nights != 7` → False |
| `>` `<` | greater / less than | `nights > 7` → False |
| `>=` `<=` | or equal | `nights >= 7` → True |

The line ends with `:` and the block below is **indented by 4 spaces**. Everything indented belongs to the `if`. The first line that isn't indented runs in every case.

## How it runs

Watch the trace at line 4: `nights >= 7 → 8 >= 7 → True`, so Python runs lines 5–6 and **skips** the `else` block completely (line 8 never appears). Lines 9–10 are not indented, so they always run.

## Common mistakes

**1. `=` instead of `==`.**

```python
if nights = 7:
```

```text
SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?
```

`=` stores a value; `==` compares. Python even suggests the fix.

**2. Forgetting the colon**, which gives `SyntaxError: expected ':'`.

**3. Wrong indentation.** A line that should be inside the block but isn't indented runs *every time*. A block with nothing indented under it gives `IndentationError: expected an indented block after 'if' statement on line …`.

**4. Boundaries.** "More than 12" is `> 12`; "12 or more" is `>= 12`. Always test the exact boundary value (here: 12).
