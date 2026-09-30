## Concept

Two keywords change what a loop does in the middle of a round:

- **`continue`** skips the **rest of this round** and jumps to the next one.
- **`break`** stops the **whole loop** immediately. Python continues with the first line after the loop.

```python
for room in range(101, 106):
    if room == 103:
        continue      # skip room 103, carry on with 104
    if room == 105:
        break         # stop completely: 105 is never printed
    print(room)
```

This prints 101, 102 and 104.

Picture a housekeeper doing rounds. `continue` means *"this room has a do-not-disturb sign, skip it and go to the next door"*. `break` means *"the supervisor called, stop the round now"*.

`break` is perfect for **searching**: stop as soon as you find what you need. `continue` keeps the main code flat when some items should be ignored.

## How it runs

In the trace, rounds 1–6 each add 450 (the total reaches 2700). In round 7, `7 % 7 == 0` is True, so the line prints *closed* and `continue` jumps straight back to line 3: the `total` line is skipped. In round 8 the total becomes 3150, `3150 >= 3000` is True, and `break` ends the loop. Nights 9–30 never happen. Line 10 then reports night 8.

## Common mistakes

**1. `continue` too late.** Code *above* the `continue` still runs for the skipped item. Put the check at the top of the loop body.

**2. Expecting `break` to leave more than one loop.** In nested loops, `break` only exits the innermost one.

**3. Using the loop variable after a loop that never ran.** If `range(...)` is empty, the loop variable never gets a value, and using it afterwards gives a `NameError`.
