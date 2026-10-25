// Post-deploy check of the PUBLISHED site (run by .github/workflows/verify-live.yml after every push to main).
// It reads the live pages, waits for a deploy that is still running, and reports what it found. It never edits
// anything and never fails because the site is slow or unreachable: a problem is reported through an issue, and the
// issue closes by itself when a later run passes.
//
//   EXPECTED_SHA   full commit id that should be live (default: GITHUB_SHA)
//   SITE_URL       default https://relocation-cost-psi.vercel.app
//   ATTEMPTS       default 14, DELAY_SECONDS default 30 (so up to about 7 minutes for the deploy to finish)
//   --report <file>  write the Markdown report
// Sets the step output `status` (ok | problem) when GITHUB_OUTPUT is available. Exits 0 either way.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { LIVE_PAGES, classifyPage, isGood, isRetryable, summarize } from "../src/lib/live-check.js";

const args = process.argv.slice(2);
const reportPath = args.includes("--report") ? args[args.indexOf("--report") + 1] : null;
const expectedSha = (process.env.EXPECTED_SHA || process.env.GITHUB_SHA || "").trim();
const siteUrl = (process.env.SITE_URL || "https://relocation-cost-psi.vercel.app").replace(/\/+$/, "");
const attempts = Math.max(1, Number(process.env.ATTEMPTS || 14));
const delayMs = Math.max(0, Number(process.env.DELAY_SECONDS ?? 30) * 1000);
const USER_AGENT = "RelocationCostLiveCheck/1.0 (post-deploy check; https://relocation-cost-psi.vercel.app/about/)";

function finish(status, report) {
  console.log(report);
  if (reportPath) fs.writeFileSync(reportPath, report + "\n");
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `status=${status}\n`);
  process.exit(0);
}

if (!/^[0-9a-f]{40}$/.test(expectedSha)) {
  finish("problem", `# Live site check: problem\n\nNo full commit id to compare with (EXPECTED_SHA/GITHUB_SHA = "${expectedSha}"). Nothing was checked.`);
}

// A page served from a commit that came AFTER the expected one means a later push already replaced it.
function isNewerCommit(served) {
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", expectedSha, served], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function readPage(page, attempt) {
  const url = `${siteUrl}${page.path}?check=${expectedSha.slice(0, 7)}-${attempt}`;
  try {
    const response = await fetch(url, {
      headers: { "user-agent": USER_AGENT, "cache-control": "no-cache" },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    });
    const body = await response.text();
    return classifyPage({ page, status: response.status, body, expectedSha, isNewerCommit });
  } catch (error) {
    return classifyPage({ page, error: error?.message || String(error), expectedSha, isNewerCommit });
  }
}

try {
  try {
    execFileSync("git", ["fetch", "--quiet", "origin", "main"], { stdio: "ignore" });
  } catch {
    // Without the fetch a newer deployed commit may look unknown; the check still runs.
  }
  let results = [];
  let used = 0;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    used = attempt;
    results = [];
    for (const page of LIVE_PAGES) results.push(await readPage(page, attempt));
    if (results.every(entry => isGood(entry.result))) break;
    // text_missing at the expected commit is final: waiting will not fix it.
    if (!results.some(entry => isRetryable(entry.result))) break;
    if (attempt < attempts) await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  const { status, report } = summarize(results, { expectedSha, siteUrl, attempts: used });
  finish(status, report);
} catch (error) {
  finish("problem", `# Live site check: problem\n\nThe check itself crashed: ${error?.message || error}\n\nNothing was changed.`);
}
