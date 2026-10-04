# Relocation Cost
A production-first relocation cost planning suite.
## Current product
- Responsive homepage
- Moving cost calculator using distance, home size, and move type
- Additional relocation cost inputs
- Local browser persistence
- Shareable calculator summary via copy-to-clipboard
- SEO guide pages
- 50 state-to-state route planning pages generated from shared route data
- Source-backed U-Haul mileage-band average used as a lower bound for the move cost; BLS labor benchmark
kept as context only
- Transparent methodology note: estimates are planning aids, not quotes
## Local development
```bash
npm install
npm run dev
<PARSED TEXT FOR PAGE: 26 / 27>
```
The calculator intentionally presents a planning estimate rather than a quote. Its core coefficients 
remain explicit MVP assumptions. The source-backed U-Haul mileage-band average is used only as a lower 
bound on the DIY base cost (so no estimate falls below the average truck rental for that distance band);
labor and service premiums on top of that base are still explicit assumptions. BLS and Census figures 
are context only and are not converted into price coefficients.
## Tests
```bash
npm test
```
Tests run on plain Node (no install needed beyond the repository) and also run in CI before the build.
## Product principles
- Build useful tools before scaling content.
- Never fabricate market data, traffic, revenue, or partner results.
- Measure calculator usage and conversion before expanding acquisition.
- Keep route pages useful and data-driven; avoid thin doorway pages or unsupported market claims.
- External account actions such as Search Console/Bing submission and affiliate-network setup remain 
separate from repository work.
## Before launch checklist
- Set `CONTACT_EMAIL` in `src/lib/site.js` (the Contact link and page stay hidden and noindex until it 
is set).
- Enable Web Analytics for the project in the Vercel dashboard (custom events need a Vercel plan that 
supports them).
- Run `python tools/make-og.py` (needs `pip install pillow`) if you change the share image text.
