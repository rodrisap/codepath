import { defineLesson } from "../../../../src/content/types";

export default defineLesson({
  goal: "Choose between several options with `if / elif / else`, and combine conditions with `and`, `or` and `not`.",
  example: {
    intro: "Seasonal pricing: December and January are high season, June to August is summer, the rest is low season.",
    code: `month = 12
nights = 3
if month == 12 or month == 1:
    season = "high"
    rate = 750
elif month >= 6 and month <= 8:
    season = "summer"
    rate = 600
else:
    season = "low"
    rate = 450
is_member = False
if nights >= 3 and not is_member:
    print("Tip: offer the loyalty membership")
print(f"{season} season: {nights} x {rate} = {nights * rate} MXN")
`,
  },
  tryIt: { prompt: "Try month 7, then month 4. Then set `is_member = True`. Predict which lines run each time, then check with **Trace**." },
  exercises: [
    {
      id: "room-type",
      title: "Pick a room type",
      prompt:
        "Ask `Guests: ` (whole number) and print the room type:\n\n- 1 guest → `Single`\n- 2 guests → `Double`\n- 3 or 4 guests → `Family`\n- more than 4 → `Too many guests for one room`",
      starter: `guests = int(input("Guests: "))
# if / elif / else
`,
      tests: [
        { kind: "output", label: "1 guest", stdin: ["1"], expect: "Guests: 1\nSingle" },
        { kind: "output", label: "2 guests", stdin: ["2"], expect: "Guests: 2\nDouble" },
        { kind: "output", label: "3 guests", stdin: ["3"], expect: "Guests: 3\nFamily" },
        { kind: "output", label: "4 guests", stdin: ["4"], expect: "Guests: 4\nFamily", hint: "4 is still a family room: `<= 4`." },
        { kind: "output", label: "6 guests", stdin: ["6"], expect: "Guests: 6\nToo many guests for one room" },
      ],
      hints: [
        "Four outcomes: `if`, two `elif`s and an `else`.",
        "Family rooms: `elif guests == 3 or guests == 4:` or `elif guests <= 4:` (the smaller numbers were already handled above).",
        '```python\nif guests == 1:\n    print("Single")\nelif guests == 2:\n    print("Double")\nelif guests <= 4:\n    print("Family")\nelse:\n    print("Too many guests for one room")\n```',
      ],
      solution: {
        code: `guests = int(input("Guests: "))
if guests == 1:
    print("Single")
elif guests == 2:
    print("Double")
elif guests <= 4:
    print("Family")
else:
    print("Too many guests for one room")
`,
        explanation: "`elif guests <= 4` is enough for 3 and 4, because 1 and 2 already stopped at an earlier line. Order does the work.",
      },
      wrongAnswers: [
        `guests = int(input("Guests: "))\nif guests == 1:\n    print("Single")\nelif guests == 2:\n    print("Double")\nelif guests < 4:\n    print("Family")\nelse:\n    print("Too many guests for one room")\n`,
        `guests = int(input("Guests: "))\nif guests == 1:\n    print("Single")\nif guests == 2:\n    print("Double")\nif guests <= 4:\n    print("Family")\nelse:\n    print("Too many guests for one room")\n`,
      ],
    },
    {
      id: "occupancy-label",
      title: "Label the occupancy",
      prompt:
        "Ask `Occupancy %: ` (decimals allowed) and print `Excellent` for 90 or more, `Good` for 70 or more, and `Low` otherwise.",
      starter: `occupancy = float(input("Occupancy %: "))
# label it
`,
      tests: [
        { kind: "output", label: "95%", stdin: ["95"], expect: "Occupancy %: 95\nExcellent", hint: "Check the order of your conditions: the strictest one must come first." },
        { kind: "output", label: "90% exactly", stdin: ["90"], expect: "Occupancy %: 90\nExcellent" },
        { kind: "output", label: "75%", stdin: ["75"], expect: "Occupancy %: 75\nGood" },
        { kind: "output", label: "70% exactly", stdin: ["70"], expect: "Occupancy %: 70\nGood" },
        { kind: "output", label: "42.5%", stdin: ["42.5"], expect: "Occupancy %: 42.5\nLow" },
      ],
      hints: [
        "The first True condition wins. Which check must come first?",
        "Start with `if occupancy >= 90:`.",
        '```python\nif occupancy >= 90:\n    print("Excellent")\nelif occupancy >= 70:\n    print("Good")\nelse:\n    print("Low")\n```',
      ],
      solution: {
        code: `occupancy = float(input("Occupancy %: "))
if occupancy >= 90:
    print("Excellent")
elif occupancy >= 70:
    print("Good")
else:
    print("Low")
`,
        explanation: "95 matches `>= 90` first. 75 fails `>= 90` and then matches `>= 70`. If you swap the order, 95 would stop at `>= 70` and be labelled Good.",
      },
      wrongAnswers: [
        `occupancy = float(input("Occupancy %: "))\nif occupancy >= 70:\n    print("Good")\nelif occupancy >= 90:\n    print("Excellent")\nelse:\n    print("Low")\n`,
        `occupancy = float(input("Occupancy %: "))\nif occupancy > 90:\n    print("Excellent")\nelif occupancy > 70:\n    print("Good")\nelse:\n    print("Low")\n`,
      ],
    },
    {
      id: "free-cancel",
      title: "Free cancellation?",
      prompt:
        "Cancellation is free if it's **7 or more days before arrival**, **or** if the guest is a member. Ask `Days before arrival: ` and `Member? (y/n) `, then print `Free cancellation` or `Cancellation fee: 50%`.",
      starter: `days = int(input("Days before arrival: "))
member = input("Member? (y/n) ")
# decide
`,
      tests: [
        { kind: "output", label: "10 days, not a member", stdin: ["10", "n"], expect: "Days before arrival: 10\nMember? (y/n) n\nFree cancellation" },
        { kind: "output", label: "2 days, member", stdin: ["2", "y"], expect: "Days before arrival: 2\nMember? (y/n) y\nFree cancellation", hint: 'Members always cancel for free: compare `member == "y"`.' },
        { kind: "output", label: "2 days, not a member", stdin: ["2", "n"], expect: "Days before arrival: 2\nMember? (y/n) n\nCancellation fee: 50%" },
        { kind: "output", label: "7 days exactly", stdin: ["7", "n"], expect: "Days before arrival: 7\nMember? (y/n) n\nFree cancellation" },
      ],
      hints: [
        "One condition with `or` combines both rules.",
        '`member` holds the text the guest typed. Compare it with `member == "y"`.',
        '`if days >= 7 or member == "y":`',
      ],
      solution: {
        code: `days = int(input("Days before arrival: "))
member = input("Member? (y/n) ")
if days >= 7 or member == "y":
    print("Free cancellation")
else:
    print("Cancellation fee: 50%")
`,
        explanation: 'For 2 days and "y": `2 >= 7` is False, but `"y" == "y"` is True, and `False or True` → True. With `and`, both would have to be True, which is not the rule.',
      },
      wrongAnswers: [
        `days = int(input("Days before arrival: "))\nmember = input("Member? (y/n) ")\nif days >= 7 and member == "y":\n    print("Free cancellation")\nelse:\n    print("Cancellation fee: 50%")\n`,
        `days = int(input("Days before arrival: "))\nmember = input("Member? (y/n) ")\nif days >= 7 or "y":\n    print("Free cancellation")\nelse:\n    print("Cancellation fee: 50%")\n`,
      ],
    },
  ],
  quiz: [
    {
      id: "first-true-wins",
      kind: "predict",
      question: "What does this print?",
      code: `score = 85
if score >= 70:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C")
`,
      options: ["A", "B", "A\nB", "C"],
      answer: 0,
      explanation: "`85 >= 70` is already True, so Python prints A and skips the rest of the chain, even though `>= 80` would also be True.",
    },
    {
      id: "logic-ops",
      kind: "predict",
      question: "What does this print?",
      code: `a = True
b = False
print(a and not b, a and b, b or a)
`,
      options: ["True False True", "False False True", "True True True", "True False False"],
      answer: 0,
      explanation: "`not b` is True, so `a and True` → True. `a and b` → False. `b or a` → True, because one side is True.",
    },
    {
      id: "or-trap",
      kind: "bug",
      question: "This prints \"High season\" even for month 5. Why?",
      code: `month = 5
if month == 12 or 1:
    print("High season")
`,
      options: [
        "`or` doesn't work with numbers",
        "`or 1` is a separate condition, and 1 counts as True; it must be `month == 12 or month == 1`",
        "It should use `and`",
        "`month` should be text",
      ],
      answer: 1,
      explanation: "Python reads it as `(month == 12) or (1)`. A non-zero number counts as True, so the whole condition is always True.",
    },
  ],
});
