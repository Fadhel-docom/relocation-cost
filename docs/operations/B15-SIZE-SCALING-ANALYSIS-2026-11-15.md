# B15 size-scaling analysis — 2026-11-15 — Claude

Scope: analysis only. No calculator code, formula, coefficient, price, UI, route data or indexing request changed. Reproduce every number with `node tools/b15-size-scaling-check.mjs` (read-only; the published numbers in it are copied from `B15-UNIFIED-MATRIX-HOLDOUT-2026-11-14.md` sections 1, 2 and 6, not re-read from the sources).

## What the earlier reports said, and what changes

The earlier reports compared the model with the **midpoint** of each published range and concluded that the model is "below the midpoint in all comparisons". A midpoint of a wide range (for example $1,957–$4,581) is not a median, so that comparison overstates the gap for the smaller sizes. Checking whether the model falls **inside** the published range gives a more useful picture:

| Size group (legacy size value) | Cells checked (3 routes) | Model inside the published range |
|---|---:|---|
| Studio / 1BR (1.0) | 3 | 3 of 3 |
| 2–3BR (1.8) | 3 | 3 of 3 |
| 4+BR (2.4) | 3 | **0 of 3**: below the low end by 21% (Boston–Miami, moveBuddha), 30% (Nashville–Burlington, moveBuddha), 22% (Nashville–Burlington, My Good Movers) |

So the evidence does not show a problem for the two smaller groups; it shows one for the largest. All of this inherits the report's assumption that 2–3BR maps to size value 1.8 and 4+BR to 2.4 (the UI labels say "rooms", not bedrooms; this is exactly the B16 question).

## Why: the model barely scales with home size

`calculateBudget` multiplies only the per-mile part by the size value. The DIY base is `max(per-mile model, U-Haul distance-band average)`, and the band average does not depend on size. At 1,071, 1,250 and 1,501 miles the floor is active for all four size options (`moveFloored` is true), so the DIY base is the same for every size ($1,657 at 1,071 and 1,250 miles, $2,190 at 1,501 miles) and only the service premium grows with size.

Result at 1,250 miles, full service, ratio to the smallest size:

| | Studio : 2nd : 3rd : 4th |
|---|---|
| Model (four size options) | 1.00 : 1.10 : 1.24 : 1.42 |
| Four-source means (Studio : 2BR : 3BR : 4+BR) | 1.00 : 1.60 : 1.93 : 3.82 |
| Route-range midpoints, 2–3BR and 4+BR vs Studio | 1.25–1.39 and 1.76–2.04 (three route checks) |

The model is flatter than every source series. That is consistent with the three misses all being in the largest group.

## The 4+BR calibration target is unstable

For 4+BR the four candidate central values are CMR $9,000, LDM $16,790, moveBuddha $5,950 and TOH $6,207.

- Unweighted mean (the owner-approved rule): **$9,487**.
- Median: $7,604. Mean without LDM: $7,052.
- Route-range midpoints for 4+BR: $7,035, $6,672, $5,749.

The rule's mean is 35% above the highest holdout midpoint, and it is driven by one source whose 4+ cell is a shipment-weight proxy (over 9,000 lb) with undisclosed n. Applying the arithmetic-mean rule literally to 4+BR would therefore overshoot the three holdouts by roughly 35–65%, while the current model undershoots them. The honest range for a large home is wide: sources span about $6,000 to $17,000 and the holdouts about $5,700 to $7,000.

## Not supported by this analysis

- Tuning any size group to the range midpoints (they are diagnostics, not targets).
- Changing Studio / 1BR or 2–3BR: the model is inside every published range for them.
- Treating the three route checks as independent validation: two come from moveBuddha, which also supplies one calibration input, and My Good Movers does not disclose n or overlap (see section 6 of the B15 report). I could not open the My Good Movers pages from my session; those three ranges rest on the earlier reading by ChatGPT.

## Proposal (needs a product decision before any code)

1. **B16 and B15 as one change, not two.** Relabeling the size options to bedrooms without calibrating would show low prices under a bedroom label; calibrating without relabeling keeps an undefined input. A single PR should (a) define the four size options as Studio/1BR, 2BR, 3BR, 4+BR while keeping the stored numeric values so old share links still load, and (b) change how the full-service price scales with size, so that the size dependence is no longer flattened by a size-independent floor.
2. **Acceptance test, fixed in advance:** every published range cell above must contain the model value (9 of 9), the Studio and 2–3BR results must not move outside their ranges, and DIY < labor < full-service ordering and the U-Haul floor for DIY must still hold. Midpoints are not a pass condition.
3. **4+BR target:** report the rule's mean and the sensitivity without LDM side by side, and prefer the lower, better-supported value for the model; say on the page that large-home quotes vary widely.
4. **Blast radius:** this changes displayed prices on every route page and calculator output, the numeric meta descriptions, the methodology section and tests. It needs the owner's approval first (decision recorded in `BACKLOG.md` under B15/B16).

## Decision requested from the owner

Approve (or reject) implementing item 1 to 4 above. If approved, I would implement it in one PR with the acceptance test written first and the site-wide meta/verify checks updated.
