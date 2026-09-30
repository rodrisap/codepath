## Concept

A `while` loop repeats **as long as a condition is True**:

```python
while balance < 1500:
    balance = balance * 1.1
```

Before each round, Python checks the condition. If it's True, the block runs, and then the check comes again. If it's False, the loop ends.

Use `while` when you **don't know in advance how many rounds** you need: "keep saving until we reach the target", "keep asking until the answer is valid". Use `for` when you do know ("for each of the 12 months").

It's like a receptionist calling the waiting list: *while there are free rooms, call the next guest.* Nobody knows beforehand how many calls it will take.

**The golden rule:** something inside the loop must change the variable in the condition. Otherwise the condition never becomes False and the loop runs forever. CodePath stops it after the time limit.

## How it runs

In the trace, line 3 checks `balance < 1500` before every round: `1000 < 1500 → True`, `1100.0 < 1500 → True`, … After round 5 the balance is `1610.5100000000002`, so the check gives False and the loop ends. Line 7 runs once. Notice the tiny float noise from round 4 on (`1464.1000000000001`). The `:.2f` in the print hides it.

## Common mistakes

**1. The endless loop.** The variable never changes:

```python
rooms = 5
while rooms > 0:
    print("Booking...")   # forgot rooms = rooms - 1
```

Here you'd see: *The program took too long.* Make sure every round moves you closer to the end.

**2. Condition the wrong way round.** `while balance > 1500:` with a start of 1000 is False immediately, so the loop runs zero times. Say the condition out loud as "keep going while…".

**3. Updating in the wrong place.** In an input loop, you must ask again *inside* the loop, or you'll check the same bad answer forever.
