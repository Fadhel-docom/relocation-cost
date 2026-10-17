# Design rules: colors and themes

## How it works

- All colors the pages use come from tokens in `src/styles/global.css` (`--page`, `--surface`, `--t900`, ...).
  The markup keeps its Tailwind class names; the stylesheet maps those classes to the tokens.
- Light is the default. Dark follows the device (`prefers-color-scheme`). The header button cycles Auto, Light, Dark
  and remembers the choice in the browser (`relocation-theme`). Printing is always light.
- `color-scheme` is set so form controls and scrollbars match the theme.

## Why these values

- Light: text is slate-900 down to a slightly darkened slate-500 (about 5.7:1 or more on every light surface),
  so small gray notes stay readable in bright sun.
- Dark: no pure black page and no pure white text. Page #0b1220, cards lighter than the page, body text 10 to 13:1,
  muted text at least 6:1. Accent text is a softened sky blue.
- The dark result card stays dark in both themes with light text; primary buttons invert (dark in light, light in dark).
- Form fields have a border of at least 3:1 against their surface (WCAG 1.4.11).
- Chart colors are separate tokens: each reaches at least 3:1 on its surface in both themes, and the legend carries the
  numbers, so color is never the only signal.
- `prefers-contrast: more` raises muted text and borders. `prefers-reduced-motion` turns off smooth scrolling.

## Rules for new work

1. Do not use a raw hex color in a page. Add or reuse a token, in all three blocks (light, dark, automatic dark) and in the print block.
2. `src/lib/contrast.test.js` checks the token pairs. Add a new pair there when you add a token.
3. Small text on light surfaces uses `text-slate-600` or darker, or `text-sky-700`. Never `text-sky-600` or `text-slate-400`.
4. Check a new page in both themes and at phone width before merging.

## Not verified by tests

The tests check the palette and the CSS logic. They do not look at the rendered pages; that needs a person (or a browser
screenshot) on the Vercel preview.
