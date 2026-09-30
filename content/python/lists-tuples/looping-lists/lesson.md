## Concept

`for` works directly on a list: each round, the loop variable holds the next item.

```python
for rate in [450, 520, 380]:
    print(rate)
```

Combined with the accumulator pattern you can total, count, filter or find the biggest item.

A **tuple** is like a list that can't be changed, written with round brackets: `("Ana", 3)`. Tuples are great for small fixed records, like a booking of *(guest, nights)*. A list of tuples works like the rows of a spreadsheet.

**Unpacking** gives each part of a tuple its own name:

```python
guest, nights = ("Ana", 3)
```

It works in a loop too:

```python
for guest, nights in bookings:
```

It's like opening an envelope that always holds the same two papers, in the same order: you can hand each one straight to the right person.

## How it runs

Each round, line 4 unpacks the next tuple: round 1 → `guest = 'Ana'`, `nights = 3`. Line 5 calculates that booking's cost, and line 6 adds the nights to the running total. In the Variables column you can see `total_nights` grow 3 → 4 → 9 while `bookings` never changes.

## Common mistakes

**1. Changing a tuple.**

```python
booking = ("Ana", 3)
booking[1] = 4
```

```text
TypeError: 'tuple' object does not support item assignment
```

Create a new tuple instead, e.g. `booking = ("Ana", 4)`, or use a list if the values must change.

**2. Unpacking the wrong number of values.** `for guest, nights, rate in bookings:` on 2-item tuples gives `ValueError: not enough values to unpack (expected 3, got 2)`.

**3. Filtering with `remove` inside the loop.** Removing items from the list you're looping over makes Python skip items. Build a *new* list with `append` instead.
