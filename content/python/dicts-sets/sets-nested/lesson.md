## Concept

A **set** holds **unique** values with no order, like the guest book's list of *countries we've welcomed*: writing "Mexico" twice doesn't add anything.

```python
countries = {"Mexico", "Canada"}
countries.add("Mexico")        # no effect: already there
```

Sets are perfect for "how many different…?" and for comparing groups:

| Code | Result |
|---|---|
| `a & b` | in both (intersection) |
| `a \| b` | in either (union) |
| `a - b` | in `a` but not in `b` |
| `set(my_list)` | the unique values of a list |

**Nesting** combines what you know. A **list of dicts** is a table: each dict is a row, and the keys are the column names. It's exactly how data arrives from a database or a CSV file, so you'll use this shape constantly:

```python
bookings = [{"guest": "Ana", "room": 7}, {"guest": "Luis", "room": 3}]
bookings[1]["guest"]   # → 'Luis'
```

## How it runs

Each round, `b` is one whole dict (one row). Line 10 adds the guest to the set; in round 3 "Ana" is already in it, so the set doesn't change. Line 12 builds a **dict of totals per room** with the `.get(key, 0) +` pattern from the last lesson. Watch `revenue_per_room` grow in the Variables column.

## Common mistakes

**1. Indexing a set.** `guests[0]` gives `TypeError: 'set' object is not subscriptable`. Sets have no positions. Use `sorted(guests)` to get an ordered list.

**2. `{}` is an empty dict, not an empty set.** Create an empty set with `set()`.

**3. Mixing up the levels.** In a list of dicts, `bookings["guest"]` fails (`TypeError: list indices must be integers or slices, not str`). First pick a row, `bookings[0]`, then the field: `bookings[0]["guest"]`.
