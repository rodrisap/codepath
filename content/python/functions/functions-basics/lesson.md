## Concept

A **function** is a named, reusable piece of code. You **define** it once and **call** it as often as you like:

```python
def booking_total(nights, rate):
    return nights * rate

booking_total(3, 450)   # → 1350
```

- `def` starts the definition. `nights` and `rate` are **parameters**: names for the values the caller hands in.
- The call `booking_total(3, 450)` passes the **arguments** 3 and 450, so inside the function `nights = 3` and `rate = 450`.
- `return` sends a value **back** to the caller and ends the function.

It's like the motel's price formula that you once typed into a spreadsheet cell: you give it inputs and it hands back a result, the same way every time.

**`print` is not `return`.** `print` shows something on screen. `return` gives a value back so the rest of your program can use it (store it, add it up, compare it). A function without `return` gives back `None`.

## How it runs

The trace shows the jump. At line 5 Python meets the call, enters the function with a **fresh set of variables** (`nights=3, rate=450`; see the "call" row), runs lines 2–3, and `return` brings `1566.0` back. Only then is it stored in `ana`. For Luis the same lines run again with different values. Notice that `subtotal` never appears in the main variables: it only lives inside the function.

## Common mistakes

**1. Printing instead of returning.** The function *shows* the right number, but `total = booking_total(3, 450)` stores `None`. Then `total * 2` crashes with `TypeError: unsupported operand type(s) for *: 'NoneType' and 'int'`. If you see `NoneType` in an error, look for a missing `return`.

**2. Code after `return`.** `return` ends the function immediately, so lines below it (in the same block) never run.

**3. Wrong number of arguments.** `booking_total(3)` gives `TypeError: booking_total() missing 1 required positional argument: 'rate'`. The message names the missing parameter.
