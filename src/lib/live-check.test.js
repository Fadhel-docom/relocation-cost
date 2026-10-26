import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { LIVE_PAGES, ROUTE_INDEX_NOTE, TRUCK_GUIDE_LEAD, classifyPage, extractBuildCommits, isGood, isRetryable, pageText, summarize } from "./live-check.js";
import { FLOOR_NOTE, BAND_NOTE, SEASON_NOTE } from "./trust.js";
import { TITLE as QUOTE_GUIDE_TITLE } from "./quote-guide.js";

const SHA = "a".repeat(40);
const OLD = "b".repeat(40);
const NEW = "c".repeat(40);
const calculator = LIVE_PAGES.find(page => page.path === "/calculator/");
const methodology = LIVE_PAGES.find(page => page.path === "/methodology/");
const home = LIVE_PAGES.find(page => page.path === "/");
const robots = LIVE_PAGES.find(page => page.path === "/robots.txt");

const html = (commit, body = "") => `<!doctype html><html><head><meta name="build-commit" content="${commit}" /></head><body><main>${body}</main></body></html>`;
const calculatorBody = `<p id="floorNote" hidden>${FLOOR_NOTE}</p><section><p>Distance bands: ${BAND_NOTE}</p><p>Timing: ${SEASON_NOTE}</p></section>`;

test("every live page has a path, a kind and a list of phrases", () => {
  for (const page of LIVE_PAGES) {
    assert.match(page.path, /^\//);
    assert.ok(["html", "text"].includes(page.kind));
    assert.ok(Array.isArray(page.texts));
    for (const phrase of page.texts) assert.ok(phrase.length > 20);
  }
});

test("the required phrases are the ones the pages render", () => {
  assert.deepEqual(calculator.texts, [FLOOR_NOTE, BAND_NOTE, SEASON_NOTE]);
  assert.deepEqual(methodology.texts, [SEASON_NOTE]);
  const calculatorSource = readFileSync(new URL("../pages/calculator.astro", import.meta.url), "utf8");
  const methodologySource = readFileSync(new URL("../pages/methodology.astro", import.meta.url), "utf8");
  assert.match(calculatorSource, /\{FLOOR_NOTE\}/);
  assert.match(calculatorSource, /\{BAND_NOTE\}/);
  assert.match(calculatorSource, /\{SEASON_NOTE\}/);
  assert.match(methodologySource, /\{SEASON_NOTE\}/);
});

test("extractBuildCommits finds the markers in either attribute order", () => {
  assert.deepEqual(extractBuildCommits(html(SHA)), [SHA]);
  assert.deepEqual(extractBuildCommits(`<meta content="${SHA}" name="build-commit">`), [SHA]);
  assert.deepEqual(extractBuildCommits("<html></html>"), []);
  assert.deepEqual(extractBuildCommits(html(SHA) + html(OLD)), [SHA, OLD]);
});

test("pageText keeps text inside forms and footers and decodes entities", () => {
  const text = pageText("<form><p>A &amp; B&#39;s   note</p></form><footer>end</footer><script>evil()</script>");
  assert.equal(text, "A & B's note end");
});

test("a page from the expected commit with every phrase is ok", () => {
  const result = classifyPage({ page: calculator, status: 200, body: html(SHA, calculatorBody), expectedSha: SHA });
  assert.equal(result.result, "ok");
  assert.ok(isGood(result.result));
});

test("the same commit with a phrase missing is text_missing and is not retried", () => {
  const result = classifyPage({ page: calculator, status: 200, body: html(SHA, `<p>${SEASON_NOTE}</p>`), expectedSha: SHA });
  assert.equal(result.result, "text_missing");
  assert.match(result.detail, /missing/);
  assert.equal(isRetryable(result.result), false);
});

test("an older commit is stale_deploy and is retried, even if the text is also missing", () => {
  const result = classifyPage({ page: calculator, status: 200, body: html(OLD, "<p>old</p>"), expectedSha: SHA });
  assert.equal(result.result, "stale_deploy");
  assert.ok(isRetryable(result.result));
});

test("a newer commit counts as superseded, and its text is not compared", () => {
  const result = classifyPage({
    page: calculator, status: 200, body: html(NEW, "<p>different wording</p>"), expectedSha: SHA,
    isNewerCommit: served => served === NEW,
  });
  assert.equal(result.result, "superseded");
  assert.ok(isGood(result.result));
});

test("a missing, doubled or non-sha marker is unknown_commit", () => {
  assert.equal(classifyPage({ page: home, status: 200, body: "<html></html>", expectedSha: SHA }).result, "unknown_commit");
  assert.equal(classifyPage({ page: home, status: 200, body: html(SHA) + html(SHA), expectedSha: SHA }).result, "unknown_commit");
  assert.equal(classifyPage({ page: home, status: 200, body: html("unknown"), expectedSha: SHA }).result, "unknown_commit");
  assert.equal(classifyPage({ page: home, status: 200, body: html("local"), expectedSha: SHA }).result, "unknown_commit");
});

test("HTTP errors and network errors are told apart", () => {
  const notFound = classifyPage({ page: home, status: 404, body: "", expectedSha: SHA });
  assert.equal(notFound.result, "http_error");
  assert.match(notFound.detail, /404/);
  const failed = classifyPage({ page: home, error: "fetch failed", expectedSha: SHA });
  assert.equal(failed.result, "unreachable");
  assert.match(failed.detail, /fetch failed/);
  assert.ok(isRetryable("http_error") && isRetryable("unreachable"));
});

test("the plain-text page only needs HTTP 200", () => {
  assert.equal(classifyPage({ page: robots, status: 200, body: "User-agent: *", expectedSha: SHA }).result, "ok");
  assert.equal(classifyPage({ page: robots, status: 500, body: "", expectedSha: SHA }).result, "http_error");
});

test("summarize reports ok when every page is good", () => {
  const results = [{ path: "/", result: "ok", detail: "x" }, { path: "/calculator/", result: "superseded", detail: "y" }];
  const { status, problems, report } = summarize(results, { expectedSha: SHA, siteUrl: "https://example.test", attempts: 1 });
  assert.equal(status, "ok");
  assert.equal(problems.length, 0);
  assert.match(report, /Live site check: ok/);
  assert.doesNotMatch(report, /What each problem means/);
});

test("summarize explains each kind of problem and says nothing was changed", () => {
  const results = [
    { path: "/", result: "stale_deploy", detail: "old" },
    { path: "/calculator/", result: "text_missing", detail: "missing: x|y" },
    { path: "/robots.txt", result: "ok", detail: "HTTP 200" },
  ];
  const { status, problems, report } = summarize(results, { expectedSha: SHA, siteUrl: "https://example.test", attempts: 3 });
  assert.equal(status, "problem");
  assert.equal(problems.length, 2);
  assert.match(report, /\*\*stale_deploy\*\*/);
  assert.match(report, /\*\*text_missing\*\*/);
  assert.match(report, /real defect/);
  assert.match(report, /Nothing was changed/);
  assert.match(report, /x\\\|y/);
});

test("the route index and two guides are checked, each with a phrase that is really in the page", () => {
  const paths = LIVE_PAGES.map(page => page.path);
  for (const path of ["/moving-cost/", "/guides/reading-a-moving-quote/", "/guides/truck-size/"]) assert.ok(paths.includes(path), path);
  assert.equal(new Set(paths).size, paths.length, "no page is listed twice");
  const read = file => readFileSync(new URL(file, import.meta.url), "utf8");
  assert.ok(read("../pages/moving-cost/index.astro").includes(ROUTE_INDEX_NOTE));
  assert.ok(read("../pages/guides/truck-size.astro").includes(TRUCK_GUIDE_LEAD));
  assert.match(read("../pages/guides/reading-a-moving-quote.astro"), /<Layout title=\{`\$\{TITLE\}/);
  assert.deepEqual(LIVE_PAGES.find(page => page.path === "/moving-cost/").texts, [ROUTE_INDEX_NOTE]);
  assert.deepEqual(LIVE_PAGES.find(page => page.path === "/guides/reading-a-moving-quote/").texts, [QUOTE_GUIDE_TITLE]);
  assert.deepEqual(LIVE_PAGES.find(page => page.path === "/guides/truck-size/").texts, [TRUCK_GUIDE_LEAD]);
});

test("each new page passes with its phrase and is text_missing without it", () => {
  for (const path of ["/moving-cost/", "/guides/reading-a-moving-quote/", "/guides/truck-size/"]) {
    const page = LIVE_PAGES.find(entry => entry.path === path);
    const good = classifyPage({ page, status: 200, body: html(SHA, `<p>${page.texts[0]}</p>`), expectedSha: SHA });
    assert.equal(good.result, "ok", path);
    const bad = classifyPage({ page, status: 200, body: html(SHA, "<p>something else</p>"), expectedSha: SHA });
    assert.equal(bad.result, "text_missing", path);
  }
});
