## Concept

A **dictionary** (`dict`) stores values under **names (keys)** instead of positions. It's the natural way to model one record, such as a booking:

```python
booking = {"guest": "Ana", "room": 7, "nights": 3}
```

Think of the booking card at reception. It has labelled fields: *Guest*, *Room*, *Nights*. You look up a field by its label, not by counting down the card.

| Code | Does |
|---|---|
| `booking["nights"]` | read a value (error if the key is missing) |
| `booking.get("email", "-")` | read, with a fallback if missing |
| `booking["nights"] = 4` | change a value, or add a new key |
| `del booking["room"]` | remove a key |
| `"email" in booking` | does the key exist? |
| `for key, value in booking.items():` | loop over all pairs |

Keys are usually strings and must be **unique**. Values can be anything: numbers, text, lists, even other dicts.

## How it runs

Line 5 reads two values by key and multiplies them. Line 6 **changes** an existing key, and line 7 **adds** a new one. Same syntax: if the key exists it's replaced, otherwise it's created. Line 8 uses `.get` with a fallback, because there is no `"email"` key. The loop on lines 9–10 visits every key/value pair in the order they were added.

## Common mistakes

**1. Reading a missing key.**

```python
booking["email"]
```

```text
KeyError: 'email'
```

The message shows exactly which key is missing. Check the spelling (keys are case-sensitive: `"Nights"` ≠ `"nights"`) or use `.get("email")`.

**2. Forgetting the quotes around a key.** `booking[nights]` looks for a *variable* called `nights`. Write `booking["nights"]`.

**3. Expecting positions.** `booking[0]` is not "the first field". It looks for a key that is the number 0 → `KeyError: 0`.
