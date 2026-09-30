## Concept

A **variable** is a name for a value, so you can reuse it:

```python
rate = 450
```

Read `=` as **"store"**, not "equals". Python first works out the right side, then stores the result under the name on the left. Think of the key board behind the reception desk: each hook has a label (`room_7`) and holds one key. Hang a new key on the hook and the old one is gone.

Every value has a **type**. The four basic ones:

| Type | Meaning | Examples |
|---|---|---|
| `int` | whole number | `3`, `-12` |
| `float` | number with decimals | `450.0`, `0.16` |
| `str` | text (string) | `"Ana"`, `"12"` |
| `bool` | yes/no | `True`, `False` |

`type(x)` tells you the type. Name rules: letters, digits and `_`, no spaces, can't start with a digit, and `Rate` ≠ `rate`. Python style is `lower_case_with_underscores`.

## How it runs

Look at line 5: `total` is calculated **once**, from the values at that moment (3 × 450.0). When line 7 changes `nights` to 4, `total` does **not** update by itself. It still holds 1350.0. A variable holds a value, not a formula (unlike a spreadsheet cell).

## Common mistakes

**1. Using a variable before it exists**

```python
print(total)
total = 3 * 450
```

```text
NameError: name 'total' is not defined
```

Python runs top to bottom: on line 1, `total` doesn't exist yet. Create it first.

**2. Quotes around a variable name.** `print("rate")` prints the word `rate`. `print(rate)` prints the value `450`.

**3. Small spelling differences.** `Nights` and `nights` are two different names. With a typo, the error message often suggests the right one: `Did you mean: 'nights'?`

**4. Expecting spreadsheet behaviour.** Changing `nights` later doesn't recalculate `total`. Run the calculation again after the change.
