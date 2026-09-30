## Brief

Motel Sol has **12 rooms**. Every morning the owner writes down how many rooms were occupied the night before. Build a **weekly occupancy report**: the program asks for the 7 numbers, shows each day's occupancy rate, and ends with a summary.

```text
Day 1 occupied rooms: 8
Day 1: 66.7%
Day 2 occupied rooms: 10
Day 2: 83.3%
...
Day 7 occupied rooms: 7
Day 7: 58.3%
Week average: 75.0%
Best day: day 3 (12 rooms)
Room revenue: 28350 MXN
```

- Occupancy rate = occupied ÷ 12 × 100, shown with 1 decimal.
- Week average = all occupied room-nights ÷ (7 × 12) × 100.
- Best day = the day with the most occupied rooms (the **first** one if there's a tie).
- Room revenue = occupied room-nights × 450 MXN.

You don't know lists yet, so everything runs in **one loop** with accumulator variables. That's exactly the loop-tracing skill this module is about.
