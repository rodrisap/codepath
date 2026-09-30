## Concept

**Comments** are notes for humans. Everything after a `#` on a line is ignored by Python:

```python
# Nightly report for Motel Sol
print("Rooms free:", 5)   # 12 rooms minus 7 guests
```

Use them to explain *why* the code does something, or to switch a line off temporarily ("commenting it out").

**Errors** are Python telling you exactly what went wrong. Treat an error like a rejected card payment slip: it tells you *which* transaction failed and *why*. Read it **from the bottom up**:

1. **Last line**: the error type and message, e.g. `NameError: name 'totl' is not defined`.
2. **Above it**: `line 6` tells you where, and shows the line itself.

There are two kinds of errors:

- A **SyntaxError** means Python couldn't read your code, so **nothing ran**.
- Any other error happens **while running**: the lines before it did run, and the program stopped at the error.

## How it runs

Lines 1 and 4 are comments, so Python skips them. Lines 2, 3 and 5 print normally. On line 6 Python meets `totl`, a name it doesn't know, so it stops with a `NameError`. Line 7 never runs. The output above the error is still there.

## Common mistakes

**1. Reading the error from the top.** The long `Traceback` part looks scary, but the last line is what matters:

```text
NameError: name 'totl' is not defined
```

Type = `NameError`, message = the name Python doesn't know. Then look at the line number just above it.

**2. The mistake is sometimes on the line *before* the reported line.** Here, the bracket opened on line 1 is never closed:

```python
print("Nights:", 3
print("Total:", 3 * 450)
```

```text
SyntaxError: '(' was never closed
```

When a SyntaxError's line looks fine, check the end of the line above it.

**3. Using `//` for comments** (as in JavaScript or Java). In Python, comments start with `#`. `// note` is a `SyntaxError: invalid syntax`.
