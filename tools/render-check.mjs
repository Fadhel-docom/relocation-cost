// Rendered-page check: opens key pages of a running site (astro preview) in a real browser at phone and desktop
// widths, in light and dark, and REPORTS: HTTP status, one <h1>, no horizontal scroll, no serious/critical axe issues.
// It never fails a build: exit code is 0 unless the tool itself cannot run. Output: status=ok|problem on stdout lines
// "status=..." (for GitHub outputs) and a Markdown report.
// Needs playwright and axe-core; RENDER_CHECK_MODULES points at a folder where they were installed (not in package.json).
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { seriousViolations, judgePage, summarize } from "../src/lib/render-check.js";

const base = (process.argv.find((a) => a.startsWith("--base=")) || "--base=http://localhost:4321").slice(7);
const reportPath = (process.argv.find((a) => a.startsWith("--report=")) || "--report=render-report.md").slice(9);
const PAGES = ["/", "/calculator/", "/methodology/", "/checklist/", "/budget-tracker/"];
const VIEWPORTS = [{ name: "375", width: 375, height: 812 }, { name: "1280", width: 1280, height: 800 }];
const SCHEMES = ["light", "dark"];

const require = createRequire((process.env.RENDER_CHECK_MODULES || process.cwd()) + "/");
const { chromium } = require("playwright");
const axePath = require.resolve("axe-core/axe.min.js");

const browser = await chromium.launch();
const results = [];
try {
  for (const vp of VIEWPORTS) for (const scheme of SCHEMES) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, colorScheme: scheme });
    const page = await ctx.newPage();
    for (const path of PAGES) {
      let problems;
      try {
        const res = await page.goto(base + path, { waitUntil: "networkidle", timeout: 30000 });
        await page.addScriptTag({ path: axePath });
        const facts = await page.evaluate(async () => ({
          h1Count: document.querySelectorAll("h1").length,
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          axe: (await window.axe.run(document)).violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map(() => 1) })),
        }));
        problems = judgePage({ status: res ? res.status() : 0, h1Count: facts.h1Count, scrollWidth: facts.scrollWidth, innerWidth: facts.innerWidth, violations: seriousViolations(facts.axe) });
      } catch (e) {
        problems = [`could not check: ${String(e.message).split("\n")[0]}`];
      }
      results.push({ path, viewport: vp.name, scheme, problems });
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}
const s = summarize(results);
writeFileSync(reportPath, `## Rendered-page check\n\n${s.text}\n`);
console.log(s.text);
console.log(`status=${s.status}`);
