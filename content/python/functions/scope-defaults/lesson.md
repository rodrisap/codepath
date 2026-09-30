## Concept

**Default values** make parameters optional:

```python
def price(nights, rate=450, breakfast=False):
```

`price(2)` uses rate 450 and no breakfast. `price(2, 600)` overrides the rate. With **keyword arguments** you can name what you pass, in any order: `price(2, breakfast=True)`. Parameters with defaults must come after those without.

**Scope**: variables created *inside* a function are **local**. They exist only while the function runs, and they're invisible outside it. A function can *read* a variable from outside, but assigning to the same name inside creates a new local one. It's like a room safe: whatever a guest puts in it during their stay is theirs alone, and it's emptied when they check out.

The clean way to get data **in** is parameters, and **out** is `return`.

A **docstring** is a string on the first line of the function body that explains what it does. `help(price)` shows it, and it's the first thing future-you will read.

## How it runs

Each call to `price` gets its own `total`. In the trace you see it created in every call row and gone again in main. In the last part, `apply_discount` sets `discount = 0.2`, but that's a **new local** variable: the `discount` in main stays `0.1`. Compare the Variables column inside and outside the function.

## Common mistakes

**1. Changing an outside variable from inside a function.**

```python
total = 0
def add(amount):
    total = total + amount
```

```text
UnboundLocalError: cannot access local variable 'total' where it is not associated with a value
```

Because the function assigns to `total`, Python treats it as local everywhere in the function. Pass the value in and return the result: `total = add(total, 450)`.

**2. Positional arguments in the wrong order.** `price(450, 2)` means nights=450, rate=2. When in doubt, use keywords: `price(nights=2, rate=450)`.

**3. A mutable default** (like `=[]`) is shared between calls. Use `None` as the default and create the list inside the function.
