# B24 — Claude's contribution to the independent cost-model room — 2026-11-17

Scope: a review and design contribution to `INDEPENDENT-COST-MODEL-EXPERIMENT.md`. It adds a new file only; no existing file on this branch was edited, no code, coefficient, price or production data changed, and no numeric parameter below is accepted as a model input. Requested by the owner/ChatGPT in the PR #256 thread (four tasks, answered in sections 2–6).

## 1. What I verified myself today (and what I could not)

| Item | Verified fact | Source (retrieved 2026-11-17) | Role |
|---|---|---|---|
| Driver hours (property-carrying) | 11 hours of driving after 10 consecutive hours off duty; no driving after the 14th consecutive hour on duty; 30-minute break after 8 cumulative driving hours; 60 h in 7 days / 70 h in 8 days, restart after 34 h off; sleeper-berth split (one period at least 2 h, the other at least 7 h in the berth, together at least 10 h); adverse-driving extension of up to 2 h; 150 air-mile short-haul exception | [FMCSA, Summary of Hours of Service Regulations](https://www.fmcsa.dot.gov/regulations/hours-service/summary-hours-service-regulations) | **Operating constraint** (turns miles into driver-days). Not a wage or cost source. |
| Industry wage context | May 2023, NAICS 484000 (all truck transportation): heavy/tractor-trailer drivers median $27.81 / mean $27.77; light truck drivers median $21.30 / mean $22.77; hand laborers and freight movers median $21.05 / mean $21.09 per hour | [BLS OEWS May 2023, NAICS 484000](https://www.bls.gov/oes/2023/may/naics4_484000.htm) | **Contextual only.** It is all truck transportation, not household-goods moving, and it is wage, not loaded cost. |
| Market size context | Employer-firm revenue for NAICS 48421 (used household and office goods moving) was $21,968 million in 2022 ($19,593 million in 2021) | [FRED series REVEF48421ALLEST](https://fred.stlouisfed.org/series/REVEF48421ALLEST) (Census Service Annual Survey) | **Context.** Not a per-job price or cost. |
| Industry-specific OEWS page for NAICS 484210 | **Not verified.** My fetch of that page was blocked by the session allowlist; I do not know its numbers. | — | Unresolved: ChatGPT or the owner should open the industry profile for 484210 and copy the exact table and date. |

Everything else in this note is design reasoning, labelled as such. I did not re-read ATRI, VIUS, EIA or BLS ECEC; I rely on the existing sections 9–10 of the experiment doc for them.

## 2. Task 1 — separate fixed load/unload cost from distance cost, and split distance into two clocks

The existing skeleton charges distance through `loadedMiles + deadheadMiles`. That under-specifies the cost, because a long move consumes two different things:

- **Miles driven:** fuel, tires, maintenance, tolls. These scale with miles.
- **Elapsed days:** driver pay, truck ownership/insurance allocated per truck-day, lodging and per diem, crew standby. These scale with *time*, and the FMCSA rules above convert miles into time in steps, not smoothly.

Proposed ledger (symbols only, no numbers):

```
T_load, T_unload   = crew-hours at origin / destination         -> depend on SIZE (volume, items, access), not on distance
T_drive            = loadedMiles / v_avg                          -> v_avg is an unresolved input (not a regulatory number)
drivingDays        = f(T_drive, 11 h limit, 14 h window, 30-min break, 10 h rest)   -> step function from the FMCSA rules
elapsedDays        = drivingDays + loading/unloading days + delivery-window wait + repositioning

fixedJobCost       = crewSize * (T_load + T_unload) * loadedHourlyLabor + packing/extras (itemized) + dispatch/admin allocation
clockCost          = elapsedDays * (driver pay + truck ownership/insurance per truck-day + lodging/per diem)
mileCost           = (loadedMiles + deadheadMiles) * (fuel price / MPG + non-fuel variable per mile)
```

Design consequences to state before any number exists:

1. The size-dependent part (`fixedJobCost`) and the distance-dependent parts (`clockCost`, `mileCost`) must be separate lines in the ledger and on screen. This is the structural fix for the B15 finding that our production model scales almost linearly with distance and barely with size.
2. The driver-days step function is a hard constraint, not a fitted curve: even a perfect operator cannot drive more than 11 hours in a duty window under these rules. A dedicated long move therefore accrues several elapsed days; a one-driver trip cannot cost a near-constant amount as distance grows. (A team of two drivers or the sleeper split changes `drivingDays`, so crew model is an explicit input, not an assumption.)
3. `v_avg`, per-truck-day ownership cost, per diem and lodging are all **unresolved** until sourced. Do not borrow a speed from a rental-company page.

## 3. Task 2 — two separate modes: dedicated truck and consolidated shipment

These are different businesses and must not share one formula.

| | Dedicated truck | Consolidated / shared linehaul |
|---|---|---|
| Who pays for the truck's trip | The one household | Several shipments share one linehaul |
| Capacity rule | Household needs `loads = max(ceil(volume/usableVolume), ceil(weight/payload))` | Household consumes a *share* of a truck: `share = max(volume/usableVolume, weight/payload)` of the usable capacity |
| Allocation question | None (whole trip) | Trip cost × share ÷ utilization; **the utilization factor is unresolved** |
| Extra costs | Deadhead/return as one trip | Pickup and delivery legs, terminal or transfer handling, waiting for a full load, longer delivery window |

Rules I propose:

1. The mode is an explicit output label. The page must never blend the two into one unlabeled number.
2. A comparator from a mover's price range cannot be assumed to be either mode. Many published prices do not say whether the shipment travels alone. Until a comparator states its mode (or the model returns both modes), a comparison is not a like-for-like validation; record the comparator's mode as "unknown" and report both modes against it.
3. **Pre-registered interpretation rule (written before any model number exists).** If the dedicated-truck mode grows far faster with distance than the observed booked-price pattern, that does not by itself mean the model is wrong, and it does not license tuning it: it would be consistent with booked prices mostly reflecting shared linehaul or backhaul. The shared-mode result should then be examined with its own utilization input. Neither mode may be tuned to the comparator; any change makes a new model version.

## 4. Task 3 — sources and defensible formulas per cost item

Status codes: **accepted role** = right kind of source, numbers not yet taken; **context** = informs but never enters the formula; **unresolved** = no defensible source yet, leave blank.

| Item | Formula term | Candidate source | Status |
|---|---|---|---|
| Driver legal limits | `drivingDays` step function | FMCSA summary (verified above) | Accepted role (constraint only) |
| Average road speed `v_avg` | `T_drive` | None identified. Do not use a rental provider's estimate or an assumed round number. | **Unresolved** |
| Fuel price | `fuelPrice` | EIA weekly on-highway diesel (and gasoline for gasoline chassis), regional series, dated to the trip | Accepted role |
| Fuel economy | `MPG` | 2021 VIUS PUF, straight trucks × GVWR class, per the existing Phase 1 plan; sample and variance check first | Accepted role, pending the VIUS check |
| Loaded vs empty miles | `deadheadMiles` | VIUS `LOADEDPCT` describes loaded-mile share by vehicle use, not for household moving specifically | Context; the moving-specific deadhead share is **unresolved** |
| Wages | `loadedHourlyLabor`, driver pay | BLS OEWS for matched occupations and geography; the NAICS 484000 table above is context, the 484210 profile is unverified | Accepted role; numbers pending |
| Employer burden | wage → loaded rate | BLS ECEC for a matched occupation group, never a flat multiplier | Accepted role; match unresolved |
| Crew size, load/unload hours | `T_load`, `T_unload` | No neutral public productivity dataset identified | **Unresolved** (do not derive from mover quote pages) |
| Truck capacity and payload | usable volume, payload | OEM completed-vehicle specs per the existing section 9 rules | Accepted role |
| Non-fuel vehicle cost per mile, ownership per truck-day, insurance, registration | `clockCost`, `mileCost` | ATRI is tractor-trailer only, not a box-truck source | **Unresolved** for box trucks |
| Lodging, per diem | `clockCost` | GSA per diem rates are one candidate for lodging and meals; not checked | Unresolved (unchecked) |
| Tolls, permits | extras | Route-specific, itemized | Unresolved |
| Overhead and margin | price layer | Company-level margins are not job margins (existing Phase 3 rule); the markup vs gross-margin formulas in Phase 3 stand | **Unresolved**; return a range or "insufficient evidence" |

## 5. Task 4 — inputs left unresolved on purpose

`v_avg`; crew size and load/unload hours by shipment size; box-truck ownership, insurance and non-fuel operating cost; deadhead/backhaul share for household moving; shared-linehaul utilization; lodging and per diem; tolls; any margin or markup. The model refuses to produce a total while a required input is in this state (existing section 7 rule) and may show a partial ledger with the missing lines flagged.

## 6. Validation: two honest corrections to the freeze agreement

The agreement is: freeze the model before looking at CMR, then use the 60 B15 probe cells for external comparison only. Two cautions:

1. **The CMR figures have already been seen.** They are committed in `data/cmr-full-service-ranges.json` and printed in `B15-DISTANCE-SHAPE-ANALYSIS-2026-11-16.md` (including medians by band and the growth ratios). Those numbers can still serve as a *reporting* comparison with its limits stated, but they cannot be called an untouched holdout for any model built by people who have read them. For a genuine holdout, collect a new set of route-level comparators from sources not yet used, with date, service scope, shipment size, mode if stated and sample count, and register the cells before running the frozen model.
2. **Define the pass thresholds before running anything**, and the same for every size and distance band. I propose these for review by ChatGPT and the owner (they are a proposal, not a decision): report coverage inside each comparator range per cell, the signed median percentage error and the absolute median percentage error per size and per distance band, separately for each mode; a cell with fewer than a fixed number of comparable sources is reported as "not tested". Numeric pass levels should be written into the experiment doc and committed before the first model run.

## 7. The product idea the owner described: a "price receipt"

The competitive value is explainability, not a lower number. If the gates pass, the visitor sees a receipt with one line per cost: crew (hours × rate), driver time (days), truck (days × allocation), fuel (gallons × price), lodging and per diem, tolls, insurance, overhead, then the commercial adjustment as a labelled range. Each line carries its source, date and a status chip: **sourced**, **scenario assumption** or **not available**. The page shows the mode (dedicated or shared), the shipment weight and volume used, and a range with the biggest sensitivity named. Building any of this before the gates pass would show unsourced numbers as if they were facts, so it stays out of scope for now. A realistic caution: if the receipt shows a total well below real quotes, users will be surprised when they request quotes; the page needs to say which services and costs are excluded.

## 8. Branch state (coordination, no action taken)

When I checked, `experiment/independent-cost-model-20261116` was dirty against `main` (PR #256 not mergeable); `main` has since gained #258. I did not merge, rebase or force anything. The conflicts are likely limited to the shared tracking files (`BACKLOG.md`, `WORK-LOG.md`, `OPS-ROOM.md`). Suggested handling, for ChatGPT or the owner to confirm first: merge `origin/main` into the branch (no force-push), resolve each shared file by keeping both sides' rows, and diff the first lines of `BACKLOG.md` and `WORK-LOG.md` afterwards. Only one agent should do this, and not while the other is pushing.

## 9. Not checked

I did not open VIUS, EIA or ATRI data; I could not read the BLS industry profile for NAICS 484210; I did not search for productivity, box-truck cost or deadhead sources beyond the items above; no numbers in section 2 are values, they are symbols for a ledger.

---

# Addendum — 2026-11-17 (afternoon): review of `B24-OPERATIONAL-INPUT-SOURCE-AUDIT-2026-11-17.md`

Requested by ChatGPT in the PR #256 thread (five review items). Documentation only; no code, coefficient, price or production data changed.

## A1. Source interpretations (item 1)

- **FMCSA applicability: ChatGPT's correction is right, and it corrects my section 2.** I re-checked two official texts today. FMCSA's CMV page defines a CMV as a vehicle used on a highway in interstate commerce to transport property or passengers that "has a gross vehicle weight rating (GVWR) of 10,001 pounds or more" (the same page lists 26,001 lb for the second weight prong). [49 CFR 390.5](https://www.govinfo.gov/link/cfr/49/390?sectionnum=5) words the threshold as GVWR or GCWR, or actual gross vehicle/combination weight, of 4,536 kg (10,001 lb) or more, "whichever is greater". Consequence for the design: my statement that the HOS limits are a "hard constraint" holds only after an applicability gate (GVWR/GCWR, interstate operation, exceptions; a rental self-move is not a for-hire property CMV). Intrastate operations follow state rules, not checked here. Also: HOS limits give *maximum* driving per duty window; they give a lower bound on a driver's duty time, never an estimate of elapsed days, because average speed and dispatch practice are unknown. I did not use a speed from them and the model must not either.
- **EIA, GSA, BLS ECEC, BLS NAICS 484:** I agree with the roles assigned (EIA dated benchmark after route-region weighting; GSA, ECEC and NAICS 484 wages context only). I did not re-fetch these sources, so this is agreement with the reasoning, not independent verification. My earlier note used May 2023 NAICS 484000 wages; the audit's May 2025 values supersede them as context.

## A2. Formula architecture: double counting and missing cost bearers (item 2)

The audit's three leg types and two clocks are right. Additions I would require before any code:

1. **State the denominator of every time-based allocation.** If truck ownership/insurance is charged per *occupied* truck-day, the annual cost must be divided by annual *occupied* days (the idle share is then already inside the rate). Dividing by available days and also adding an idle charge counts idle twice; dividing by available days and charging occupied days only undercounts.
2. **Count each person-hour once.** Build a role × task matrix (driver, lead, loaders; tasks: loading, driving, unloading, waiting) and sum person-hours from it. A driver who also loads appears once in labor, not once as "driver time" and again as "crew". The pay basis is an input (hourly, per-mile, per-load, salaried) and is not assumed to be hourly.
3. **Add an "included categories" column to the source register.** For every source: does its rate already include fuel, labor, insurance, depreciation, overhead, profit? A test then fails if two ledger lines draw on sources that both include the same category.
4. **Cost bearers not yet named in the ledger** (each is in the model, an itemized extra, or explicitly excluded, never silently absent): cargo/valuation coverage and claims reserve, separate from vehicle liability; workers' compensation (check whether the chosen ECEC group already includes it before adding it); moving equipment and supplies (pads, dollies, straps, ramps); terminal or warehouse handling for the consolidated mode; regulatory registrations; booking/broker/lead-generation fees, which belong to the commercial layer and which change what "the price" means (carrier price versus the customer's booked price); delays and rescheduling in the consolidated mode.
5. **Fuel by leg and load state.** Loaded and empty MPG differ; VIUS gives a fleet MPG, not a loaded/empty split. The ledger keeps gallons per leg, so a later split can be added without changing the structure.

## A3. VIUS download (item 3): not possible from my environment

My request to the Census directory (`www2.census.gov/programs-surveys/vius/datasets/2021/`) was refused by the session network policy (HTTP 403 from the proxy). I did not try other routes. The files must come from the owner: the 2021 VIUS PUF CSV ZIP, the data dictionary (Excel) and the PUF user guide (PDF), from the Census landing page. After an upload I will record checksums and the retrieval date, and reproduce the Census guide example and published totals before any box-truck subset, as the audit requires.

## A4. Sources for the remaining gaps (item 4): none closes the core cost gaps, one new comparator

I found no source for box-truck non-fuel cost per mile, truck ownership per truck-day, crew productivity, average speed, household-moving deadhead or shared-load utilization; they stay unresolved. One new source type is useful for **validation**, not as a cost input:

- **State-regulated household-goods tariffs.** I read Washington's [UTC Tariff 15-C](https://www.utc.wa.gov/sites/default/files/2026-06/TV-250890%20-%20Tariff%2015-C%20-%20Effective%2020260101.pdf) (effective 2026-01-01; the same agency also lists a 2026 rate-increase supplement that I did not read). It covers moves within Washington only. Items are **minimum–maximum bands**, not single prices. Local moves (55 miles or less) are priced per hour with the truck and driver separated from each additional worker (Item 230: truck and driver $39.20–$154.38 per hour for three hours or less; each additional worker $30.69–$134.48). Long-distance moves (over 55 miles) are priced per pound by loaded-distance step and weight bracket (Item 200; at 55–60 miles, 8,000–11,999 lb: $0.1112–$0.5762 per lb), with a seven-pounds-per-cubic-foot minimum density rule for weight (Item 105). California's [Maximum Rate Tariff 4](https://www.bhgs.dca.ca.gov/industry/maxratetariff4.pdf) exists as a second regulator document; I did not read it.
- **Why it helps:** it is government-published, dated and independent of the mover price pages, none of our team has used it yet (so it can serve as an untouched comparator), and it prices crew, truck and weight as separate lines, which is the structure the owner wants to show.
- **Limits:** these are regulated *prices* (a band set by the commission), not operating costs; the band is about 4–5 times wide from minimum to maximum; intrastate only, so no 1,000+ mile interstate checks; the long-distance table I read stops at the distances Washington allows; the 2026 supplement may change the numbers. A comparison with a model would report where the model falls inside the band, and nothing tighter.

## A5. Branch coordination (item 5)

PR #256 remains non-mergeable against `main`. I did not merge or rebase, and I still suggest one agent does a non-force merge of `origin/main` into the branch, keeping both sides' rows in `BACKLOG.md`, `WORK-LOG.md` and `OPS-ROOM.md`, then diffing the first lines of each. My two commits on this branch only add or append to `B24-CLAUDE-CONTRIBUTION-2026-11-17.md`, so they cannot conflict with that merge.

## A6. Not checked in this addendum

EIA, GSA, ECEC and OEWS values (not re-fetched); whether the ECEC groups include workers' compensation; intrastate HOS rules; the Washington supplement and the California tariff; VIUS microdata (unreachable).
