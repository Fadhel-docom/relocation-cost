# B15 second-publisher holdout — 2026-11-15 — ChatGPT

Repository: Fadhel-docom/relocation-cost  
Branch: `research/b15-mygoodmovers-holdout-20261115`  
Scope: source research and operations documentation only.

## Work completed

- Re-read OPS-ROOM.md, BACKLOG.md, the B15 matrix/holdout report, the 2026-11-14 session addendum, and the earlier price-evidence file.
- Searched for an independent publisher's route-specific full-service comparison rather than relying only on moveBuddha.
- Found My Good Movers' Nashville, TN → Burlington, VT route page (1,071 miles) with separate service types and bedroom-size ranges.
- Read its published pricing methodology (updated 2026-10-18): figures combine mover-submitted rates, quote requests, anonymous calculator entries/estimates, and prices paid disclosed in reviews; figures are refreshed monthly and grouped by service/size/distance/location.
- Recomputed the midpoint comparison against the already verified current calculator move-component outputs for the same near-identical route: Studio/1BR −30.7%; 2–3BR −32.4%; 4+BR −45.7%.

## Evidence and limits

The route page's 500+ verified movers is a directory count, **not** a price observation count. MGM does not publish route × size n, source-contribution shares, the exact underlying observation window, or proof that its source observations do not overlap other publishers' data. Its methodology is better disclosed than a pure black-box modeled route estimate, but its mixed inputs (advertised rates, quote/estimate data, and disclosed paid prices) are not a homogeneous invoice-only sample.

This is a second-publisher directional holdout, not independent-sample validation. It supports the hypothesis that the current move component may be low, particularly for larger shipments, but does not justify a coefficient or price change.

## Decision / next action

- B15 remains doing; B16 remains gated.
- No application code, formulas, coefficients, prices, UI, route data, production deployment, or indexing requests changed.
- Next research step: seek route-cell n and observation window from MGM or find another second-publisher route source that discloses sample counts and service scope; audit ownership/data lineage before treating it as independent. Keep the existing unweighted matrix provisional until three eligible comparable source values per cell and holdout checks pass.
- No application build/tests were run because this was research/documentation only.

## Sources

- https://mygoodmovers.com/popular-routes/tn/nashville-to-burlington
- https://mygoodmovers.com/help/article/moving-pricing-methodology
