# AI Answer Visibility Benchmark — 30 prompts
**Created:** 2026-11-01 | **Status:** test protocol prepared; live AI-platform observations not yet captured.

## Test protocol
- Keep wording, locale (English, United States), and run date consistent. Record product/surface, signed-in state if known, answer text excerpt, cited domains/URLs, whether Relocation Cost is named, whether a project URL is cited, competitors cited, factual accuracy, and screenshot/evidence reference.
- Run each prompt in ChatGPT Search, Google AI Overviews/AI Mode where shown, and Microsoft Copilot. A normal web search result is not an AI answer citation. Do not infer an AI mention from indexed pages.
- Repeat the same 30 prompts monthly, not repeatedly every day. AI answers vary by location, personalization, model and time; this is a directional sample, not a ranking guarantee.
- Score each platform separately: brand mention (0/1), domain citation (0/1), relevant page citation (0/1), answer accuracy (0/1), competitor citations (list). Do not add scores across platforms as if they were search volume.
- For prompts asking current prices, verify source date and geography. Do not reward the site for being cited if the answer misrepresents the estimate as a quote.

## Prompt set
### A. Core intent and cost (1–8)
1. How much does an interstate move cost in the United States?
2. What factors have the biggest effect on the cost of moving between states?
3. How can I estimate a moving budget before I have a mover quote?
4. How much should I budget for a 2-bedroom interstate move?
5. What costs should I include beyond the moving company price?
6. How do DIY, rental truck with labor, and full-service moving compare?
7. Why do moving costs vary so much for the same distance?
8. What is the difference between a moving cost estimate and a written mover quote?

### B. Route-specific intent (9–14)
9. How much might it cost to move from California to Texas?
10. What should I budget to move from Florida to New Jersey?
11. What affects the cost of moving from New York to Pennsylvania?
12. How should I estimate a move from Ohio to Florida?
13. Is state-to-state distance the same as driving mileage when estimating a move?
14. How can I estimate costs for a route before I know the exact addresses?

### C. Methodology and trust (15–21)
15. How does a moving cost calculator estimate transportation costs?
16. What does a moving budget calculator include and exclude?
17. How accurate are online moving cost calculators?
18. Why might a calculator use straight-line distance instead of road miles?
19. What does a 10% contingency allowance mean in a moving budget?
20. Does a $0 optional cost mean I will not have that expense?
21. How should I use historical rental-truck averages when planning a move?

### D. Comparing real mover estimates (22–26)
22. How do I compare three interstate moving company estimates fairly?
23. What is the difference between binding and non-binding moving estimates?
24. What fees or services should I check before accepting a mover estimate?
25. How can I tell whether two mover estimates cover the same inventory and services?
26. What should I verify about an interstate mover before booking?

### E. Employer relocation (27–30)
27. How do I compare an employer relocation lump sum with my moving budget?
28. What should I ask HR about relocation benefits before accepting a job?
29. What is the difference between cash relocation assistance and expenses paid directly?
30. Are employer-paid moving expenses taxable in the United States?

## Target page map
| Prompt range | Main page(s) | Citation / accuracy guardrail |
|---|---|---|
| 1–8 | /guides/moving-cost/ and /calculator/ | No universal national average without a defensible sample; label outputs as planning estimates. |
| 9–14 | Existing route pages only where present; /calculator/ | Route-specific values must come from the calculator/model and show straight-line vs road-mile distinction. |
| 15–21 | /methodology/ and /calculator/ | Explain assumptions, U-Haul September 2025 benchmark, zero fields, 10% contingency and ±20% planning band accurately. |
| 22–26 | /guides/moving-cost/ | Use FMCSA primary sources; distinguish mover quote types and compare equal inventory/services. |
| 27–30 | /guides/employer-relocation-package/ and /calculator/ | No tax advice; prompt 30 requires current IRS primary-source verification before publishing a substantive answer. |

## Competitor recording
Record only competitors actually cited by the platform for each prompt. Likely comparison set to watch, not assumed citations: moveBuddha, HireAHelper, Moving.com, U-Haul, This Old House, FMCSA, and relevant mover/provider sites.

## Initial run — 2026-11-01
- Google web-search spot check: exact-domain queries for the production Vercel hostname plus core brand/methodology terms returned no results in the web search tool. This is a limited tool observation, not proof the site is absent from Google Search or AI Overviews; it does not substitute for Search Console or a direct browser session.
- AI answer surfaces: no direct answer/citation observation was available in this session for ChatGPT Search, Google AI Overviews/AI Mode, or Copilot. Status is **Not tested**, not zero citations.
- Bing AI Performance: official documentation confirms the report measures cited URLs, citation counts, grounding queries and trends across Copilot, Bing AI summaries and selected partner integrations. The report is aggregated and sampled; it is not a prompt-by-prompt answer log. Verify availability in the actual property dashboard.
- Google: official guidance says normal SEO fundamentals and distinctive, useful content remain foundational; it rejects special AEO hacks, unnecessary llms.txt, and inauthentic mentions. A Google generative AI performance report is described in current guidance, but account availability must be checked directly.

## Blank observation template
| Date | Platform / surface | Prompt # | Brand mention | Domain cited | URL cited | Competitors cited | Answer accurate? | Evidence / notes |
|---|---|---:|---:|---|---|---|---|---|
| — | — | — | Not tested | Not tested | Not tested | — | — | Awaiting direct platform run |

## Decision rule
Do not rewrite pages based on one volatile answer. Look for recurring query clusters, incorrect facts, missing source pages, and repeated competitor citations across multiple prompts and runs. Use Bing AI Performance and GSC for aggregated visibility, and the manual benchmark for qualitative answer sampling.