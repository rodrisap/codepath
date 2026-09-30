## Concept

Python's arithmetic operators:

| Operator | Meaning | Example | Result |
|---|---|---|---|
| `+` `-` `*` | add, subtract, multiply | `3 * 450` | `1350` |
| `/` | divide (always gives a float) | `7 / 2` | `3.5` |
| `//` | whole-number division | `17 // 7` | `2` |
| `%` | remainder ("modulo") | `17 % 7` | `3` |
| `**` | power | `2 ** 3` | `8` |

`//` and `%` are a pair: 17 nights is `17 // 7 = 2` full weeks and `17 % 7 = 3` extra nights.

**Operator order** works like school maths: first `( )`, then `**`, then `*` `/` `//` `%`, then `+` `-`. Operators at the same level run left to right. It's the same as a spreadsheet formula. `=A1+B1*2` doesn't add first either. When in doubt, add brackets. They cost nothing and make your intent obvious.

## How it runs

Line 6 is the interesting one. Python multiplies first (`2 * 2800` and `3 * 450`) and then adds. The trace shows each step: `2 * 2800 + 3 * 450 → 5600 + 3 * 450 → 5600 + 1350 → 6950`. Lines 11–12 show how brackets change the result.

## Common mistakes

**1. Forgetting operator order.** "Rate plus cleaning fee, times nights":

```python
total = 450 + 200 * 3    # 1050: only the fee was multiplied!
total = (450 + 200) * 3  # 1950
```

**2. Expecting `/` to give a whole number.** `10 / 5` is `2.0` (a float), not `2`. Use `//` when you need a whole number.

**3. Dividing by zero.** `revenue / nights` with `nights = 0`:

```text
ZeroDivisionError: division by zero
```

The message names the problem directly. Find which variable is 0 (you'll learn to guard against this with `if` in Module 5).

**4. `^` is not "power".** In Python `2 ^ 3` is `1` (a bit operation). Use `2 ** 3`.
