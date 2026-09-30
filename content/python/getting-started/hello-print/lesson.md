## Concept

A **program** is a list of instructions that the computer follows **from top to bottom, one line at a time**, exactly as written. It never guesses what you meant.

Think of the check-in checklist at the motel's front desk. A new receptionist follows it step by step, in order. If a step is written wrong, they do the wrong thing. Code works the same way.

Your first instruction is `print()`. It shows something on the screen. Whatever it shows is called the **output**.

- Text goes inside quotes: `print("Hello")`. Text in quotes is called a **string**.
- Numbers need no quotes: `print(450)`. Python can calculate too: `print(3 * 450)` shows `1350`.
- Separate several values with commas and `print` puts one space between them: `print("Rooms:", 12)` shows `Rooms: 12`.
- `print()` with nothing inside prints an empty line.

## How it runs

Each `print` line runs once, in order, and adds one line to the output. On line 3, Python first calculates `3 * 450 = 1350` and then prints the result. The trace below shows this step by step.

## Common mistakes

**1. Forgetting the quotes around text**

```python
print(Welcome)
```

```text
NameError: name 'Welcome' is not defined
```

Without quotes, Python thinks `Welcome` is the name of a variable (you'll meet those soon). Read the error as: *"I don't know anything called Welcome."* Fix: `print("Welcome")`.

**2. Mismatched or missing quotes/brackets**

```python
print("Rooms available: 12)
```

```text
SyntaxError: unterminated string literal (detected at line 1)
```

A **SyntaxError** means Python couldn't even read the line, so nothing ran. Check that every `"` has a partner and every `(` has a `)`.

**3. Capital letters**: `Print("hi")` fails with `NameError: name 'Print' is not defined. Did you mean: 'print'?`. Python is case-sensitive: `print` ≠ `Print`.
