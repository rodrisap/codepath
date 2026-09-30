## Concept

**`elif`** ("else if") lets you check several options in order:

```python
if guests == 1:
    room = "Single"
elif guests == 2:
    room = "Double"
else:
    room = "Family"
```

Python checks the conditions **from top to bottom and runs only the first one that is True**. Then it skips the rest of the chain. It's like a price list: you read down until you find your line, and you stop there.

Combine conditions with **logical operators**:

| Operator | True when… | Example |
|---|---|---|
| `and` | both sides are True | `month >= 6 and month <= 8` |
| `or` | at least one side is True | `month == 12 or month == 1` |
| `not` | flips True ↔ False | `not is_member` |

Python even lets you write `6 <= month <= 8`.

## How it runs

In the trace, line 3 checks `month == 12 or month == 1 → 12 == 12 or 12 == 1 → True or 12 == 1 → True`. Once the left side of `or` is True, the answer is decided. Python runs lines 4–5 and jumps past the `elif` and `else` without checking them (lines 6–11 never appear). Line 13 combines `and` with `not`.

## Common mistakes

**1. Wrong order in an elif chain.** The first True wins, so put the strictest condition first:

```python
if occupancy >= 70:      # 95 stops here...
    label = "Good"
elif occupancy >= 90:    # ...so this line is never reached
    label = "Excellent"
```

**2. `or` with a bare value.** `if month == 12 or 1:` is *always* True, because `1` on its own counts as True. Write the comparison twice: `month == 12 or month == 1`.

**3. Several `if`s instead of `elif`.** Separate `if` statements are *all* checked, so more than one can run. Use `elif` when exactly one option should apply.
