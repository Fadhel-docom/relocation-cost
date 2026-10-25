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

// results: [{ path, viewport, scheme, problems: [] }]
export function summarize(results) {
  const bad = results.filter((r) => r.problems.length > 0);
  const lines = [`Checked ${results.length} page views; ${bad.length} with problems.`];
  for (const r of bad) {
    lines.push(`- ${r.path} (${r.viewport}, ${r.scheme}): ${r.problems.join("; ")}`);
  }
  return { status: bad.length ? "problem" : "ok", total: results.length, problemCount: bad.length, text: lines.join("\n") };
}
