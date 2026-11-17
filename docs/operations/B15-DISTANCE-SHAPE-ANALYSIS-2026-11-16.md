# B15 distance-shape analysis — 2026-11-16 — Claude

Scope: diagnosis only. No calculator code, formula, coefficient, price, UI or data file changed. Every number below comes from `node tools/b15-cmr-band-check.mjs` (read-only), which reads `data/cmr-full-service-ranges.json` and the current `calculateBudget()`.

## What this adds to `B15-POST-MERGE-AUDIT-2026-11-16.md`

The post-merge audit compares three routes (1,071, 1,089 and 1,501 miles). This note compares all 20 CMR cells (five distance bands × four size groups) at three probe distances each (60 probes), and tests the size-exponent idea from my 2026-11-15 analysis. Two corrections to my own earlier notes:

- The 2026-11-15 conclusion "inside the published range for Studio/1BR and 2–3BR" held only for the route-level ranges at 1,071–1,501 miles and used one value (1.8) for the combined 2–3BR group; it is not a four-size result. The post-merge audit is right to say it must not authorise recalibration.
- The size exponent I proposed (premium × size^2.25, studio unchanged) is **not** recommended: see section 3.

## 1. The larger error is the distance shape, not only the size scaling

Full-service move component against the CMR 25th–75th percentile range (60 probes): **45 below, 8 inside, 7 above.**

| Size value | Below | Inside | Above |
|---|---:|---:|---:|
| 1.0 (studio / 1 bedroom) | 7 | 2 | 6 |
| 1.35 (about 2 bedrooms) | 9 | 5 | 1 |
| 1.8 (about 3 bedrooms) | 14 | 1 | 0 |
| 2.4 (4+ bedrooms) | 15 | 0 | 0 |

How the price moves from the shortest to the longest band (CMR median, 100–499 miles → 2,000+ miles, against the model at 300 → 2,500 miles):

| Size value | CMR medians by band | CMR growth | Model growth |
|---|---|---:|---:|
| 1.0 | 1,980 → 2,130 → 2,120 → 2,540 → 2,590 | ×1.31 | ×6.53 |
| 1.35 | 2,990 → 3,130 → 3,400 → 3,640 → 4,010 | ×1.34 | ×6.33 |
| 1.8 | 4,920 → 5,160 → 5,390 → 5,970 → 5,850 | ×1.19 | ×6.14 |
| 2.4 | 7,220 → 7,590 → 9,000 → 9,470 → 10,000 | ×1.39 | ×5.96 |

CMR's booked prices barely rise with distance (about 20–40% over 100 to 2,000+ miles) and are driven mostly by home size. Our full-service component is almost proportional to distance and nearly flat in size. So the model is far below CMR at 100–999 miles for every size (model/median 0.14–0.66), roughly right at 1,000–1,999 miles, and above CMR for the studio and 2-bedroom sizes at 2,000+ miles (1.58 and 1.14).

## 2. Do the independent ranges agree with CMR?

Against the 15 secondary-compilation ranges already used in `tools/published-price-check.mjs` (Opendoor/NAVL/Angi, read 2026-11-10): the CMR median is inside the published range in **15 of 15** cells; the current model is inside in **3 of 15**. Caveats: those 15 ranges are not independent of each other (Opendoor compiles NAVL and others) and I have not verified whether any of them reuses CMR data. For 4+ bedrooms the publishers do not agree: CMR overlaps moveBuddha's route ranges (8,010–8,726 at 1,501 miles; 7,620–8,900 at 1,089 miles) but not My Good Movers' (3,964–7,534 at 1,071 miles), and Long Distance Moving's 4+ cell is a shipment-weight proxy.

## 3. A size exponent alone is not a fix

Model / CMR median at the middle probe of each band, for the three larger sizes (studio is unchanged by the exponent):

| Band (probe) | Today (k = 1) 1.35 / 1.8 / 2.4 | Exponent k = 2.25, 1.35 / 1.8 / 2.4 |
|---|---|---|
| 100–499 (300 mi) | 0.24 / 0.17 / 0.14 | 0.28 / 0.24 / 0.25 |
| 500–999 (750 mi) | 0.50 / 0.34 / 0.27 | 0.58 / 0.50 / 0.53 |
| 1,000–1,499 (1,250 mi) | 0.77 / 0.54 / 0.37 | 0.89 / 0.79 / 0.74 |
| 1,500–1,999 (1,750 mi) | 0.97 / 0.66 / 0.48 | 1.13 / 0.98 / 0.97 |
| 2,000+ (2,500 mi) | 1.14 / 0.89 / 0.61 | **1.36 / 1.36 / 1.27** |

It improves 1,000–2,000 miles, leaves 100–999 miles still 40–75% below, and pushes 2,000+ miles above CMR's median for every larger size. It trades one error for another and is dropped.

## 4. What this means for the owner's decision on B24

The owner decided on 2026-11-16 not to rely on moving-company price pages and to build an independent cost model (B24). That decision stands; nothing here asks to anchor the calculator to CMR. The evidence is useful as **held-out validation targets**, never as calibration inputs, for the future bottom-up model:

1. The model's full-service price should rise by roughly ×1.2–1.4 between 100–499 and 2,000+ miles, not ×6.
2. Home size should be a distance-independent driver (CMR medians at 1,000–1,499 miles: 2,120 / 3,400 / 5,390 / 9,000 for the four sizes).
3. For sizes up to 3 bedrooms the result should land inside the 15 published ranges in section 2; for 4+ bedrooms it should land in the overlap where publishers overlap, and say so where they do not.

Until the bottom-up model passes such checks, the page keeps the current estimate beside the CMR range and discloses the difference.

## Not checked

CMR figures were not re-read from the source by me (the post-merge audit read the 2026 report); the 15 published ranges are copied from the earlier reading; probe distances inside each band are a choice (three per band, the 2,000+ band at 2,000, 2,500 and 3,000 miles); other costs and contingency are excluded on both sides; DIY and truck-plus-labor are not compared (no comparable public data in hand); local moves under 100 miles are not covered by CMR.
