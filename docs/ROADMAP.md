# Roadmap

One improvement per working day, each shipped as a PR with a green CI before merge.
Goal: reach the highest level of quality and accuracy for US moves first, then open
other countries.

## Rules

- Formulas and coefficients stay unchanged until real, dated quotes exist to calibrate them.
- No invented data: new inputs default to 0 and are left out of the total until the user knows an amount.
- No spending before the first revenue. No GA4 (Vercel Analytics + Search Console only).
- Do not add new route pages until the current ones are being indexed.

## P0: calculator depth

- [x] Day 1: itemized costs (fuel, insurance, packing, equipment, utility connection) and a cash buffer until first income (PR #24)
- [x] Day 2: cost breakdown chart (share of each cost) and savings tips shown after the result
- [x] Day 3: print and save-as-PDF summary of the budget (browser print, no paid service)
- [x] Day 5: four more optional itemized costs (storage, crew tips, specialty items, access fees), a "Costs people often forget" section and an independence statement (ideas from docs/COMPETITOR_IDEAS_2.md)

## P1: trust and content

- [x] Day 8: moving checklist at /checklist/ (dated from the move date, saved in the browser, printable, no prices)
- [x] Day 6: employer relocation package mode: enter what the employer offers and see the gap (the site does not calculate taxes)
- [x] Day 9: planned vs actual budget tracker at /budget-tracker/ (line by line, saved in the browser, copies the costs typed in the calculator, totals compare like with like, printable, every number typed by the user)
- [x] Day 4: visible last-updated date, sources and margin of error on the calculator page (shown by the result, in a "How reliable is this estimate?" section and in the print summary)
- [x] Day 10: "What each option usually covers" in the DIY vs movers guide (who does what per move type, no prices; the list of costs outside the move cost is read from the calculator and tested against it)
- [x] Day 14: automatic freshness for the quote guide's sources: a weekly GitHub Action (.github/workflows/check-sources.yml, tools/check-sources.mjs) downloads the regulation text (49 CFR pages), checks the figures the guide relies on are still stated and refreshes their verified dates by itself (tests, build and verify-seo run first); a changed or unreadable source opens one issue and changes nothing; the FMCSA pages block automated downloads, so they are re-read by a person with an issue reminder 30 days before the page warns readers; the page shows a visible warning when any source is over 180 days old; the build never fails because of a date
- [x] Day 15: the same weekly check now compares the U-Haul one-way averages the calculator uses (expected figures are built from data/coefficients.json) with U-Haul's published page; a mismatch opens the issue, no number is ever changed automatically; the calculator shows when they last matched
- [x] Day 11: real figures in the meta descriptions of the 50 state and 44 city route guides (2–3 room planning totals for the three move types and the U-Haul band average, from the same calculation as the page; build check: at most 160 characters, figures must also appear on the page, no duplicates)
- [x] Day 12: "How to read a moving quote" guide at /guides/reading-a-moving-quote/ (binding vs non-binding estimates, the 110% rule, coverage; every rule cites an official FMCSA or CFR page read on 2026-10-18; tests require a listed source for each rule and limit the figures to those the sources state)

## P2: growth

- [x] Day 13: "Email this estimate to myself" button on the calculator (opens the person's own email app with the summary and the share link; no server, no paid service; the message is shortened in a fixed order if the link would be too long)
- [ ] Cost-of-living comparison between two cities
- [x] Dark mode (Day 7): automatic from the device setting, with a header button for Auto / Light / Dark; palette checked against WCAG AA by tests; see docs/DESIGN.md

## International expansion (only after the US site reaches its quality target)

Order: English-speaking countries first (Canada, United Kingdom, ...), then the other
wealthiest European countries (including Germany). One country at a time, one step per
day. A country opens only with real, sourced data (currency, units, benchmark prices).

## Resuming work

1. Read this file and the open PRs, check `main` and the CI.
2. Do the next unchecked item, open a PR, wait for a green CI, merge.
3. Tick the item here and note the next one.
