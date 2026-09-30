## Brief

Motel Sol's pricing rules live in the owner's head. Time to write them down as code, so any receptionist can give the right price.

**Season rate per night:**

| Months | Season | Rate |
|---|---|---|
| December, January | high | 750 MXN |
| June, July, August | summer | 600 MXN |
| all other months | low | 450 MXN |

**Extra guests:** the rate includes 2 guests. Each extra guest adds **150 MXN per night**.

**Weekly discount:** stays of **7 nights or more** get **10% off** the subtotal.

Example run:

```text
Month: 7
Nights: 8
Guests: 3
Season: summer (600 MXN/night)
Extra guest fee: 150 MXN/night
Subtotal: 6000.00 MXN
Weekly discount: -600.00 MXN
Total: 5400.00 MXN
```

The "Extra guest fee" line only appears when there are extra guests, and the "Weekly discount" line only when the discount applies.
