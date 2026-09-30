## Brief

The motel keeps a log of every stay. The owner wants a **guest registry**: one entry per guest, with how often they came, how many nights they stayed and how much they spent. From that registry, a short loyalty report.

The log is a list of dicts (one per stay). You'll turn it into a **dict of dicts**:

```python
registry = {
    "Ana Lopez": {"visits": 3, "nights": 6, "spent": 2700},
    ...
}
```

Then print:

```text
Guests: 4 from 4 countries
Top spender: John Smith (3100 MXN)
Repeat guests: ['Ana Lopez', 'John Smith']
Average stay: 2.7 nights
```
