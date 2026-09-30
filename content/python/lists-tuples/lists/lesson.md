## Concept

A **list** stores many values in one variable, in order:

```python
rates = [450, 520, 380, 610]
```

Each item has a **position (index), starting at 0**. Think of a row of mailboxes behind the desk numbered 0, 1, 2, 3.

| Code | Result | Meaning |
|---|---|---|
| `rates[0]` | `450` | first item |
| `rates[-1]` | `610` | last item (negative = count from the end) |
| `rates[1:3]` | `[520, 380]` | a **slice**: from index 1 up to (not including) 3 |
| `len(rates)` | `4` | number of items |
| `380 in rates` | `True` | is it in the list? |

Lists can change. These **methods** modify the list itself:

| Method | Does |
|---|---|
| `.append(x)` | add `x` at the end |
| `.insert(i, x)` | put `x` at position `i` |
| `.remove(x)` | delete the first `x` |
| `.pop()` | remove and return the last item |
| `.sort()` | sort (add `reverse=True` for high → low) |

## How it runs

Watch the `rates` variable in the trace: `append` adds 700 at the end, `remove(380)` deletes 380 wherever it is, and `sort()` reorders the list in place. After sorting, `rates[0]` is the cheapest rate and `rates[-1]` the most expensive.

## Common mistakes

**1. Index out of range.** A list of 4 items has indexes 0–3:

```python
rates[4]
```

```text
IndexError: list index out of range
```

Use `rates[-1]` for the last item, or check with `len()`.

**2. Storing the result of `.sort()`.** `sorted_rates = rates.sort()` gives `None`, because `.sort()` changes the list and returns nothing. Either call `rates.sort()` on its own line, or use `sorted_rates = sorted(rates)` for a sorted *copy*.

**3. Removing something that isn't there.** `rates.remove(999)` gives `ValueError: list.remove(x): x not in list`. Check with `if 999 in rates:` first.
