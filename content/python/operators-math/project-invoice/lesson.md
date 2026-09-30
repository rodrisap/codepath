## Brief

Build the invoice calculator the front desk has been doing by hand. A couple stays **3 nights** at **850 MXN**, with breakfast for **2 people × 3 days** at **95 MXN** each. As returning guests they get a **5% loyalty discount**, and then **16% VAT** is added. The accountant also wants the total in **euros** (21.5 MXN per euro).

The finished invoice:

```text
INVOICE - Motel Sol
Room (3 nights x 850.00): 2550.00 MXN
Breakfast (6 x 95.00): 570.00 MXN
Subtotal: 3120.00 MXN
Loyalty discount (5%): -156.00 MXN
Net: 2964.00 MXN
VAT (16%): 474.24 MXN
TOTAL: 3438.24 MXN
TOTAL in EUR: 159.92 EUR
```

Work in two steps: first the numbers (checked one by one), then the printout. Put every intermediate result in its own well-named variable. That's how real invoice code stays checkable.
