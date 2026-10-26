// Rendered-page check: opens key pages of a running site (astro preview) in a real browser at phone and desktop
// widths, in light and dark, and REPORTS: HTTP status, one <h1>, no horizontal scroll, no serious/critical axe issues.
// It never fails a build: exit code is 0 unless the tool itself cannot run. Output: status=ok|problem on stdout lines
// "status=..." (for GitHub outputs) and a Markdown report.
// Needs playwright and axe-core; RENDER_CHECK_MODULES points at a folder where they were installed (not in package.json).
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { seriousViolations, judgePage, summarize, formatMoney, parseMoney, expectedDisplay, compareDisplay, judgeInvalidState } from "../src/lib/render-check.js";
import { calculateBudget } from "../src/lib/calculator.js";

const base = (process.argv.find((a) => a.startsWith("--base=")) || "--base=http://localhost:4321").slice(7);
const reportPath = (process.argv.find((a) => a.startsWith("--report=")) || "--report=render-report.md").slice(9);
const PAGES = [
  "/", "/calculator/", "/methodology/", "/checklist/", "/budget-tracker/", "/cost-of-living/",
  "/guides/diy-vs-movers/", "/guides/reading-a-moving-quote/", "/guides/truck-size/",
  "/moving-cost/ca-to-tx/", "/moving-cost/cities/new-york-to-miami/",
];
const VIEWPORTS = [{ name: "375", width: 375, height: 812 }, { name: "1280", width: 1280, height: 800 }];
const SCHEMES = ["light", "dark"];

const require = createRequire((process.env.RENDER_CHECK_MODULES || process.cwd()) + "/");
const { chromium } = require("playwright");
const axePath = require.resolve("axe-core/axe.min.js");

const browser = await chromium.launch();

// ---- Calculator scenarios: type real values and check what the result panel shows. -------------------------
// Expected numbers come from the same calculation library the page uses, so a stale or wrong panel is caught.
const readPanel = (page) => page.evaluate(() => {
  const text = (id) => document.querySelector("#" + id)?.textContent.trim() ?? null;
  const hidden = (id) => document.querySelector("#" + id)?.hidden ?? null;
  const dist = document.querySelector("#distance");
  return {
    result: text("result"), mobileTotal: text("mobileTotal"), move: text("moveResult"), other: text("otherResult"),
    contingency: text("contingencyResult"), range: text("range"), error: text("inputError"),
    distance: dist.value, distanceInvalid: dist.getAttribute("aria-invalid"), helper: text("stateHelp"),
    cashHidden: hidden("cashBox"), employerHidden: hidden("employerBox"),
    reserveResult: text("reserveResult"), cashNeeded: text("cashNeededResult"),
  };
});

const SCENARIOS = [
  {
    name: "typing values updates the result and adds each extra once",
    async run(page, base) {
      const problems = [];
      await page.goto(base + "/calculator/", { waitUntil: "networkidle", timeout: 30000 });
      await page.fill("#distance", "500");
      await page.selectOption("#size", "1.35");
      await page.selectOption("#type", "1");
      let shown = await readPanel(page);
      problems.push(...compareDisplay("500 mi, 2-3 rooms, truck + labor", shown, expectedDisplay(calculateBudget({ distance: 500, size: 1.35, type: 1 }))));
      const before = shown;
      await page.fill("#travel", "100");
      await page.fill("#fuel", "50");
      shown = await readPanel(page);
      problems.push(...compareDisplay("after travel $100 and fuel $50", shown, expectedDisplay(calculateBudget({ distance: 500, size: 1.35, type: 1, travel: 100, fuel: 50 }))));
      const otherDelta = (parseMoney(shown.other) ?? NaN) - (parseMoney(before.other) ?? NaN);
      if (otherDelta !== 150) problems.push(`extras were added ${otherDelta} dollars to other costs, expected exactly 150`);
      const prev = shown;
      await page.fill("#distance", "1500");
      shown = await readPanel(page);
      problems.push(...compareDisplay("after distance 1500", shown, expectedDisplay(calculateBudget({ distance: 1500, size: 1.35, type: 1, travel: 100, fuel: 50 }))));
      if (shown.result === prev.result) problems.push("changing the distance left the old total on screen");
      return problems;
    },
  },
  {
    name: "invalid input shows an error and no old estimate, then recovers",
    async run(page, base) {
      const problems = [];
      await page.goto(base + "/calculator/", { waitUntil: "networkidle", timeout: 30000 });
      await page.fill("#distance", "800");
      await page.fill("#distance", "0");
      let shown = await readPanel(page);
      problems.push(...judgeInvalidState("distance 0", shown));
      if (shown.distanceInvalid !== "true") problems.push("distance 0: field is not marked aria-invalid");
      await page.fill("#distance", "800");
      shown = await readPanel(page);
      if (shown.error) problems.push(`distance back to 800: error still shown ("${shown.error}")`);
      if (shown.distanceInvalid !== null) problems.push("distance back to 800: aria-invalid was not cleared");
      problems.push(...compareDisplay("distance back to 800", shown, expectedDisplay(calculateBudget({ distance: 800, size: 1, type: 0.65 }))));
      await page.fill("#travel", "-5");
      shown = await readPanel(page);
      problems.push(...judgeInvalidState("travel -5", shown));
      await page.fill("#travel", "0");
      shown = await readPanel(page);
      if (shown.error) problems.push(`travel back to 0: error still shown ("${shown.error}")`);
      return problems;
    },
  },
  {
    name: "typed distance survives other changes; a state change refills it; reset restores defaults",
    async run(page, base) {
      const problems = [];
      await page.goto(base + "/calculator/", { waitUntil: "networkidle", timeout: 30000 });
      const start = await readPanel(page);
      await page.fill("#distance", "900");
      await page.selectOption("#size", "1.8");
      await page.fill("#travel", "25");
      await page.selectOption("#type", "1.65");
      let shown = await readPanel(page);
      if (shown.distance !== "900") problems.push(`typed 900 miles, then changed size, type and travel: distance became ${shown.distance}`);
      problems.push(...compareDisplay("typed 900 miles", shown, expectedDisplay(calculateBudget({ distance: 900, size: 1.8, type: 1.65, travel: 25 }))));
      await page.selectOption("#toState", "NY");
      shown = await readPanel(page);
      if (shown.distance === "900") problems.push("changing a state did not refill the distance");
      if (!/Auto-filled/.test(shown.helper || "")) problems.push("after a state change the help text does not say the distance was auto-filled");
      await page.click("#reset");
      shown = await readPanel(page);
      if (shown.distance !== start.distance) problems.push(`reset: distance is ${shown.distance}, expected the starting ${start.distance}`);
      if (shown.result !== start.result) problems.push(`reset: total is ${shown.result}, expected the starting ${start.result}`);
      return problems;
    },
  },
  {
    name: "cash buffer and employer boxes appear only when used",
    async run(page, base) {
      const problems = [];
      await page.goto(base + "/calculator/", { waitUntil: "networkidle", timeout: 30000 });
      let shown = await readPanel(page);
      if (shown.cashHidden !== true) problems.push("cash buffer box is visible before any amount is entered");
      if (shown.employerHidden !== true) problems.push("employer box is visible before any amount is entered");
      await page.selectOption("#reserveWeeks", "4");
      await page.fill("#weeklyLiving", "500");
      shown = await readPanel(page);
      const calc = calculateBudget({ distance: Number(shown.distance), size: 1, type: 0.65, reserveWeeks: 4, weeklyLiving: 500 });
      if (shown.cashHidden !== false) problems.push("cash buffer box did not appear for 4 weeks x $500");
      if (shown.reserveResult !== formatMoney(calc.reserve)) problems.push(`cash buffer shows ${shown.reserveResult}, expected ${formatMoney(calc.reserve)}`);
      if (shown.cashNeeded !== formatMoney(calc.cashNeeded)) problems.push(`cash to have ready shows ${shown.cashNeeded}, expected ${formatMoney(calc.cashNeeded)}`);
      await page.fill("#weeklyLiving", "0");
      shown = await readPanel(page);
      if (shown.cashHidden !== true) problems.push("cash buffer box stayed visible after the amount went back to 0");
      await page.fill("#employerCash", "500");
      shown = await readPanel(page);
      if (shown.employerHidden !== false) problems.push("employer box did not appear for a $500 lump sum");
      await page.fill("#employerCash", "0");
      shown = await readPanel(page);
      if (shown.employerHidden !== true) problems.push("employer box stayed visible after the amount went back to 0");
      return problems;
    },
  },

  {
    name: "print and share actions work and keep the estimate",
    async run(page, base) {
      const problems = [];
      await page.addInitScript(() => {
        window.print = () => { window.__renderCheckPrintCalled = true; };
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: { writeText: async (value) => { window.__renderCheckCopiedText = value; } },
        });
      });
      await page.goto(base + "/calculator/", { waitUntil: "networkidle", timeout: 30000 });
      await page.fill("#distance", "500");
      const total = await page.locator("#result").textContent();
      await page.click("#print");
      const printState = await page.evaluate(() => ({
        called: window.__renderCheckPrintCalled === true,
        total: document.querySelector("#printTotal")?.textContent.trim(),
        route: document.querySelector("#printRoute")?.textContent.trim(),
        distance: document.querySelector("#printDistance")?.textContent.trim(),
      }));
      if (!printState.called) problems.push("print button did not call window.print()");
      if (!printState.total || printState.total !== total?.trim()) problems.push(`print summary total shows "${printState.total}", expected "${total?.trim()}"`);
      if (!printState.route) problems.push("print summary route is empty");
      if (!/500/.test(printState.distance || "")) problems.push(`print summary distance is "${printState.distance}", expected it to include 500 miles`);
      await page.click("#share");
      const shareState = await page.evaluate(() => ({
        status: document.querySelector("#shareStatus")?.textContent.trim(),
        copied: window.__renderCheckCopiedText || "",
      }));
      if (shareState.status !== "Share link copied to your clipboard.") problems.push(`share status is "${shareState.status}"`);
      if (!shareState.copied.includes("distance=500")) problems.push(`copied share link does not preserve distance=500: "${shareState.copied}"`);
      if (!shareState.copied.includes("/calculator/?")) problems.push(`copied share link does not point to the calculator: "${shareState.copied}"`);
      return problems;
    },
  },
  {
    name: "email action blocks invalid input instead of opening a draft",
    async run(page, base) {
      const problems = [];
      await page.goto(base + "/calculator/", { waitUntil: "networkidle", timeout: 30000 });
      await page.fill("#distance", "0");
      await page.click("#email");
      const status = await page.locator("#shareStatus").textContent();
      if (!/Fix the input above before emailing\./.test(status || "")) {
        problems.push(`email invalid-input message is "${status?.trim()}", expected a clear validation message`);
      }
      return problems;
    },
  },
];

async function runScenarios() {
  const out = [];
  for (const vp of VIEWPORTS) {
    for (const sc of SCENARIOS) {
      // A fresh browser context per scenario, so saved inputs (localStorage) from one never leak into the next.
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, colorScheme: "light" });
      const page = await ctx.newPage();
      let problems;
      try {
        problems = await sc.run(page, base);
      } catch (e) {
        problems = [`could not run: ${String(e.message).split("\n")[0]}`];
      }
      out.push({ path: `/calculator/ [${sc.name}]`, viewport: vp.name, scheme: "light", problems });
      await ctx.close();
    }
  }
  return out;
}

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
  results.push(...(await runScenarios()));
} finally {
  await browser.close();
}
const s = summarize(results);
writeFileSync(reportPath, `## Rendered-page check\n\n${s.text}\n`);
console.log(s.text);
console.log(`status=${s.status}`);
