// Pure helpers for tools/render-check.mjs (rendered-page checks run on pull requests).
// The checks only REPORT. They never decide whether a build passes.

export const SERIOUS_IMPACTS = ["serious", "critical"];

// Keep only the accessibility violations that matter for this report.
export function seriousViolations(axeViolations = []) {
  return axeViolations
    .filter((v) => SERIOUS_IMPACTS.includes(v.impact))
    .map((v) => ({ id: v.id, impact: v.impact, nodes: (v.nodes || []).length, help: v.help }));
}

// One page, one viewport, one colour scheme -> a list of plain problem strings.
export function judgePage({ status, h1Count, scrollWidth, innerWidth, violations }) {
  const problems = [];
  if (status !== 200) problems.push(`HTTP ${status}`);
  if (h1Count !== 1) problems.push(`expected one <h1>, found ${h1Count}`);
  if (scrollWidth > innerWidth + 1) problems.push(`horizontal scroll: content ${scrollWidth}px wide in a ${innerWidth}px window`);
  for (const v of violations) problems.push(`accessibility ${v.impact}: ${v.id} (${v.nodes} element${v.nodes === 1 ? "" : "s"})`);
  return problems;
}

// Money the way the calculator page writes it ("$1,234", no cents).
export function formatMoney(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

// "$1,234" -> 1234. Anything that is not an amount (for example the "—" shown for invalid input) -> null.
export function parseMoney(text) {
  const m = /^\$([\d,]+)$/.exec(String(text ?? "").trim());
  return m ? Number(m[1].replace(/,/g, "")) : null;
}

// What the result panel must show for one calculateBudget() result.
export function expectedDisplay(r) {
  return {
    result: formatMoney(r.total),
    mobileTotal: formatMoney(r.total),
    move: formatMoney(r.move),
    other: formatMoney(r.other),
    contingency: formatMoney(r.contingency),
    range: `${formatMoney(r.rangeLow)}–${formatMoney(r.rangeHigh)}`,
  };
}

// Compare what the page shows with what the calculation library says it should show.
// Returns a list of plain problem strings (empty when everything matches).
export function compareDisplay(label, shown, expected) {
  const problems = [];
  for (const key of Object.keys(expected)) {
    if (shown[key] !== expected[key]) problems.push(`${label}: ${key} shows "${shown[key]}", expected "${expected[key]}"`);
  }
  return problems;
}

// A result panel that says "invalid input" must not still show an old estimate.
export function judgeInvalidState(label, shown) {
  const problems = [];
  if (!shown.error) problems.push(`${label}: no error message shown`);
  for (const key of ["result", "mobileTotal", "move", "other", "contingency", "range"]) {
    if (shown[key] !== "—" && shown[key] !== undefined && shown[key] !== null) problems.push(`${label}: ${key} still shows "${shown[key]}" next to an error`);
  }
  return problems;
}

// results: [{ path, viewport, scheme, problems: [] }]
export function summarize(results) {
  const bad = results.filter((r) => r.problems.length > 0);
  const lines = [`Checked ${results.length} page views and calculator scenarios; ${bad.length} with problems.`];
  for (const r of bad) {
    lines.push(`- ${r.path} (${r.viewport}, ${r.scheme}): ${r.problems.join("; ")}`);
  }
  return { status: bad.length ? "problem" : "ok", total: results.length, problemCount: bad.length, text: lines.join("\n") };
}
