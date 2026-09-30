## Concept

A **loop** repeats a block of code. A `for` loop repeats it **once for each value** in a sequence:

```python
for night in range(1, 4):
    print("Night", night)
```

Each round, `night` gets the next value: 1, then 2, then 3. Then the loop ends.

`range` produces numbers. Note that the **end number is not included**:

| Code | Values |
|---|---|
| `range(4)` | 0, 1, 2, 3 |
| `range(1, 4)` | 1, 2, 3 |
| `range(0, 10, 3)` | 0, 3, 6, 9 (step of 3) |

The most useful loop pattern in business code is the **accumulator**: start a total at 0 *before* the loop and add to it *inside* the loop. It's what you do when you count the cash drawer: start at zero and add each bill.

## How it runs

Follow the trace row by row. Line 4 hands out the next value of `night` (the rounds are numbered). Line 5 adds the rate: `total = total + rate → 0 + 500 → 500`, then `500 + 500 → 1000`, and so on. After round 4 there are no values left, so Python leaves the loop and runs line 7, **once**.

## Common mistakes

**1. Off by one.** `range(1, nights)` stops *before* `nights`, so a 4-night stay only loops 3 times. Use `range(1, nights + 1)`, or `range(nights)` when you don't care about the numbering.

**2. Resetting the total inside the loop.**

```python
for night in range(1, 5):
    total = 0              # reset every round!
    total = total + 500
```

`total` ends up as 500, not 2000. The start value belongs *before* the loop.

**3. Indentation decides what repeats.** A `print` indented under the `for` runs every round. Not indented, it runs once after the loop. Check with Trace when the output is repeated (or not) unexpectedly.
