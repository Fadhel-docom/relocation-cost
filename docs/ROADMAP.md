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
- [ ] Expected vs actual budget tracking during the move
- [x] Day 4: visible last-updated date, sources and margin of error on the calculator page (shown by the result, in a "How reliable is this estimate?" section and in the print summary)
- [ ] Real figures in meta descriptions for route pages

## P2: growth

- [ ] "Email me this estimate" (free, no paid service)
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
