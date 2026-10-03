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
- Source-backed U-Haul mileage-band and BLS labor benchmarks kept separate from the planning model
- Transparent methodology note: estimates are planning aids, not quotes

## Local development

```bash
npm install
npm run dev
```

The calculator intentionally presents a planning estimate rather than a quote. Its core coefficients remain explicit MVP assumptions. Source-backed U-Haul and BLS figures are displayed as contextual benchmarks and are not converted into universal price coefficients.

## Product principles

- Build useful tools before scaling content.
- Never fabricate market data, traffic, revenue, or partner results.
- Measure calculator usage and conversion before expanding acquisition.
- Keep route pages useful and data-driven; avoid thin doorway pages or unsupported market claims.
- External account actions such as Search Console/Bing submission and affiliate-network setup remain separate from repository work.
