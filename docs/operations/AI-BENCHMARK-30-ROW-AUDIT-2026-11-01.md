# 30-row audit of the AI answer benchmark — Claude, 2026-11-01

**Scope:** independent relevance / value / competitor-gap audit of the 30 prompts in `AI-ANSWER-VISIBILITY-BENCHMARK-30-QUESTIONS-2026-11-01.md`. Docs only. No production change, no indexing request, no outreach, no formula change.

**Status of the benchmark task: still OPEN.** This audit gives every prompt a disposition and a next action. It does not test any AI surface and it does not close any prompt.

## How I checked

- Read each target page's source in the repo (`src/pages/**`, `src/lib/**`, `data/route-pages.json`) at main `f7a6947`.
- Competitor evidence is **only** what ChatGPT recorded in the benchmark (This Old House, FreightWaves Checkpoint, GoodMigrations, moveBuddha, Three Movers, MoveDayMap, Have a Good Move). I did not open those pages in this session, so I do not add or confirm competitor claims.
- AI surfaces: I have no direct ChatGPT Search, Google AI Overviews / AI Mode or Copilot access in this session, and no tool that reads Bing AI Performance or the Search Console Generative AI report. Every re-test below is therefore **Not tested** — not zero.

## Correction to the benchmark's target-page map

The map sends prompts 22–26 to `/guides/moving-cost/`. That guide covers cost factors, truck averages and planning totals. It does not cover quote types or mover checks. The pages that actually answer those prompts already exist:

| Prompts | Map says | Better target (verified in source) |
|---|---|---|
| 8, 22–25 | `/guides/moving-cost/` | `/guides/reading-a-moving-quote/` (sections: binding or non-binding at a glance, grouped rules, questions to ask before you sign, where the calculator fits, sources) |
| 26 | `/guides/moving-cost/` | `/guides/checking-a-mover/` (grouped checks, where to look and who to call, what the pages do not say, questions before you pay, sources) |
| 5, 6 | `/guides/moving-cost/`, `/calculator/` | add `/guides/diy-vs-movers/` (what each option covers, price gap, costs people forget) |
| 3, 19 | `/guides/moving-cost/`, `/calculator/` | add `/guides/relocation-budget/` (four buckets, Step 3 "Add a buffer" explains the 10 % buffer) |

I edited the map table in the benchmark file to match. Without this fix, a re-test would grade the wrong pages.

## Row-level audit

Relevance classes: **A** = directly relevant and served by an existing page/tool; **B** = relevant but under-served; **C** = out of scope (reason required). Priority: P1 act first, P2 next, P3 monitor only.

| # | Prompt (short) | Class | Current target | User-value gap | Competitor advantage (from benchmark only) | Differentiation / action | Priority | Re-test / closure |
|---|---|---|---|---|---|---|---|---|
| 1 | Interstate move cost, US | B | `/guides/moving-cost/` (truck averages, planning totals by distance), `/calculator/` | The site refuses a national average on purpose; the guide gives distance tables, not a headline number | This Old House (analysis of 1,000+ quotes), moveBuddha, USMove, Moving-Calculator.net publish ranges and datasets | Do not chase. Keep the "planning estimate, not a quote" framing. Do not publish a national average without a sample we can defend | P3 | Not tested. Close only as "intentionally not competing on headline averages" if repeat tests never cite us |
| 2 | Biggest cost factors | A | `/guides/moving-cost/` (Distance, Home size, Who does the work, Timing, Access, Costs around the move) | Mostly covered; no gap proven | Not recorded in benchmark | Keep; verify answer accuracy at re-test | P3 | Not tested |
| 3 | Estimate budget before a quote | A | `/calculator/`, `/guides/relocation-budget/`, `/` | This is the product's core job; no content gap | Not recorded | First prompt to re-test. Home-page answer block (M1) supports it | P1 | Not tested |
| 4 | Budget for a 2-bedroom interstate move | B | Route pages and guide show a 2–3 room scenario | No page answers "2-bedroom" with a labelled figure for a chosen distance; the scenario is a 2–3 room band | Not recorded | Label the 2–3 room scenario plainly in the route answer sentence (M3a). No new page | P2 | Not tested |
| 5 | Costs beyond the mover | A | `/guides/diy-vs-movers/` (costs people forget), calculator "Costs people often forget", `/guides/packing-boxes/` | None proven | Not recorded | Keep | P3 | Not tested |
| 6 | DIY vs truck+labor vs full service | A | `/guides/diy-vs-movers/` | None proven | Not recorded | Keep | P3 | Not tested |
| 7 | Why costs vary for the same distance | A | `/guides/moving-cost/`, band-step note in the result card | Distance-band jumps (+463 to +823 USD measured on 2026-10-25) are explained in the result, but not as a stand-alone answer in the guide | Not recorded | Possible short guide paragraph tying the band jump to U-Haul's published bands. Only if numbers come from the data files | P2 | Not tested |
| 8 | Estimate vs written quote | A | `/guides/reading-a-moving-quote/`, `/methodology/` | None proven | Not recorded | Keep; this is a trust differentiator | P2 | Not tested |
| 9 | CA to TX | A | `/moving-cost/ca-to-tx/` (exists) | Crowded route intent; GSC positions on route queries were 70–100 | FreightWaves Checkpoint, GoodMigrations, moveBuddha, Three Movers | M3a: short answer sentence + band-jump line near the H1. Do not copy quote-derived market ranges | P1 | Not tested; compare GSC impressions/position at 7 and 14 days |
| 10 | FL to NJ | A | `/moving-cost/fl-to-nj/` (exists) | Owner's phone video (2026-10-31): no cost figure on the first screen; the calculator link is about one screen down | Not recorded | M3a is the direct fix; M3b (table scroll) separate | P1 | Not tested |
| 11 | NY to PA | A | `/moving-cost/ny-to-pa/` (exists) | Not inspected beyond existence | Not recorded | Covered by the same M3a template | P2 | Not tested |
| 12 | OH to FL | A | `/moving-cost/oh-to-fl/` (exists) | Not inspected beyond existence | Not recorded | Covered by the same M3a template | P2 | Not tested |
| 13 | State distance vs driving miles | B | Calculator help text, result note, methodology, route and city FAQ | The site says what it does (straight line between state centers) but not how large the gap usually is | Not recorded | R4 stays blocked until HeiGIT confirms commercial use in writing; no coefficient without a source | P2 | Not tested |
| 14 | Estimate a route without addresses | A | Calculator state selector, route pages | None proven | Not recorded | Keep | P3 | Not tested |
| 15 | How a calculator estimates transport | A | `/methodology/` (premium formula, base, per-mile rate, multipliers) | None proven | Not recorded | Keep | P2 | Not tested |
| 16 | What a calculator includes and excludes | A | `/methodology/` (insurance, taxes, utility fees, real estate excluded), diy-vs-movers "What is inside this site's estimate" | None proven | Not recorded | Keep | P2 | Not tested |
| 17 | Accuracy of online calculators | B | "How reliable is this estimate?" (±20 % is a fixed band, not a statistical interval) | No calibration against real quotes exists, so we cannot show a measured error | Not recorded | The honest limits are the differentiator. Calibration needs 3–5 dated real quotes for one route (optional, owner only) | P2 | Not tested; closes only after calibration data exists or as "limits disclosed" |
| 18 | Why straight-line instead of road miles | B | Same pages as 13 | Pages state the approximation but do not explain why it was chosen (state-level inputs, no addresses) | Not recorded | Add one sentence of rationale to methodology; no new data needed | P2 | Not tested |
| 19 | What a 10 % contingency means | A | `/guides/relocation-budget/` (Step 3, "Add a buffer"), `/methodology/` formula | None proven | Not recorded | Keep | P3 | Not tested |
| 20 | Does a $0 optional cost mean no expense | A | `/methodology/` ("left at $0 is left out of the total. It is not known to be free") | Clear and rare; low expected volume | Not recorded | Keep as a precise-answer asset | P3 | Not tested |
| 21 | Using historical truck averages | A | `/guides/moving-cost/` (average one-way truck rental by distance) | Period is September 2025 per ChatGPT's 2026-11-01 check of U-Haul's page; I did not reopen it | Not recorded | Keep wording "historical benchmark inside the DIY component", never "live price" | P2 | Not tested |
| 22 | Compare three mover estimates fairly | B | `/guides/reading-a-moving-quote/` (questions list only) | No side-by-side scope worksheet | MoveDayMap Quote Decoder, Have a Good Move (paid review) | Defer. Build only if the quote-scope assessment finds a real gap; privacy-minimal, no uploads | P2 | Not tested |
| 23 | Binding vs non-binding | A | `/guides/reading-a-moving-quote/` | The 2026-11-01 review found the FMCSA definition must be worded carefully (do not pay more than the estimate at delivery) | Not recorded | Keep wording aligned to the sources; no change proposed here | P2 | Not tested |
| 24 | Fees and services to check | A | `/guides/reading-a-moving-quote/` | None proven | Not recorded | Keep | P2 | Not tested |
| 25 | Same inventory and services across estimates | B | Same guide (questions only) | Same gap as 22 | MoveDayMap, Have a Good Move | Same decision as 22 | P2 | Not tested |
| 26 | Verify an interstate mover | A | `/guides/checking-a-mover/` | None proven; FTC lines were checked by ChatGPT, not by me | Not recorded | Keep; the "what the pages do not say" section is a differentiator | P2 | Not tested |
| 27 | Lump sum vs moving budget | A | Calculator employer box, `/guides/employer-relocation-package/` | None proven | Not recorded | This is the clearest unique tool. Strongest candidate for repeatable citation | P1 | Not tested |
| 28 | What to ask HR | A | Employer guide "Questions to ask your employer" (marked as our own questions) | None proven | Not recorded | Keep | P2 | Not tested |
| 29 | Cash assistance vs paid directly | A | Employer box fields, guide, employer-package question list | None proven | Not recorded | Keep | P2 | Not tested |
| 30 | Employer-paid moving expenses taxable | A (high stakes) | Employer guide (IRS Pub 15-B 2026, Form 3903 instructions) | Pub 15-B was read only to character 100000 of 119768 in the 2026-10-27 reading; no tax advice | Not recorded | Re-read the two IRS sources fully before any new tax wording; keep the "not tax advice" line | P1 | Not tested |

## Disposition summary

- **A (directly relevant, served):** 23 prompts — 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 19, 20, 21, 23, 24, 26, 27, 28, 29, 30.
- **B (relevant, under-served):** 7 prompts — 1, 4, 13, 17, 18, 22, 25.
- **C (out of scope):** none. Prompt 1 is the closest; I class it B and mark "do not chase" instead of forcing it out of scope.
- Total 30. A class does not mean closed: every row stays open until a dated direct re-test exists.

## What this changes in the plan

1. **Page quality over visibility tactics.** The audit found no prompt where the existing page is wrong. The proven gaps are first-screen answers on route pages (10, 9, 4), the road-versus-straight-line size of the gap (13, blocked on R4), a one-line rationale for the distance method (18), and unmeasured accuracy (17). None needs a new page.
2. **Order of execution stays behind the 2026-11-05 gate:** M1 (home answer block), then M3a (route answer sentence plus band-jump line), then M3b separately. This audit does not change that order.
3. **Employer package (27–30) is the most defensible differentiator.** It combines a working tool, primary sources and an explicit "what the sources do not say" section. Re-read the IRS pages fully before relying on prompt 30.
4. **Quote comparison (22, 25) stays deferred.** Competitors exist; our edge would be scope normalization without uploads, and only after the assessment shows a gap.
5. **No re-test can be recorded from this session.** All 30 rows stay open. Closure per row needs a dated direct run on each available AI surface, or an owner export from Bing AI Performance / Search Console, with brand mention, domain citation, URL, accuracy, competitors and evidence.

## Requests

- **Owner (optional, not blocking):** screenshots or exports from Bing Webmaster Tools > AI Performance and Search Console > Generative AI performance, or "report not visible".
- **ChatGPT:** do not change the page map again without checking page source; use this file's table when preparing re-tests; open the competitor pages cited in the benchmark and record what they actually offer on prompts 9, 10 and 22.

## Limits of this audit

- Competitor evidence is second-hand (from the benchmark). I did not open any competitor page.
- Rows 11 and 12 were checked for page existence only, not for content quality.
- No AI surface was tested. No rendering was checked in a browser.
