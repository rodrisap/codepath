## Concept

`input()` lets your program **ask a question and wait** for an answer:

```python
name = input("Guest name: ")
```

The text in the brackets is the **prompt**. The program pauses, you type an answer and press Enter, and the answer is stored in the variable.

**`input()` always gives you text (a `str`)**, even if you type `3`. To calculate with it, convert it:

```python
nights = int(input("Nights: "))
```

Python works inside-out here. `input(...)` runs first and returns `"3"`, then `int("3")` turns it into `3`.

Think of it like a paper registration form at reception. Whatever the guest writes is just ink. You still have to *read* "3" as a number before you can multiply it. Most small programs follow the same shape: **input → process → output**.

## How it runs

The example runs with the input `Ana`, `3` and `450`. In the output you see each prompt followed by what was typed, just like in a terminal. In the trace, notice that `nights` becomes the number `3` (no quotes) because of `int(...)`, while `name` stays text.

## Common mistakes

**1. Forgetting to convert.** `nights = input("Nights: ")` then `nights * 450` doesn't crash. It repeats the text! `"3" * 450` is `"333…"`. And `nights + 1` crashes:

```text
TypeError: can only concatenate str (not "int") to str
```

Fix: `nights = int(input("Nights: "))`.

**2. Converting the wrong kind of number.** Typing `450.50` into `int(input(...))` gives:

```text
ValueError: invalid literal for int() with base 10: '450.50'
```

Use `float(...)` for amounts that can have decimals.

**3. No space at the end of the prompt.** `input("Nights:")` makes the answer stick to the colon (`Nights:3`). End prompts with a space: `"Nights: "`.
