// Answer-first summary for a state route. Values come from the same calculator
// scenarios rendered in the table, so the summary cannot drift from the page's figures.
const money = value => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
}).format(value);

export function routeAnswer({ from, to, homeSize, scenarios }) {
  if (typeof from !== "string" || !from.trim() || typeof to !== "string" || !to.trim()) {
    throw new TypeError("from and to must be non-empty route names.");
  }
  if (typeof homeSize !== "string" || !homeSize.trim()) {
    throw new TypeError("homeSize must be a non-empty label.");
  }
  if (!Array.isArray(scenarios) || scenarios.length !== 3
    || !scenarios.every(item => item && typeof item.label === "string" && Number.isFinite(item.total))) {
    throw new TypeError("scenarios must contain three labelled, finite planning totals.");
  }

  const totals = scenarios.map(item => `${money(item.total)} for ${item.label.toLowerCase()}`);
  return `For a ${homeSize} home, this model puts a move from ${from} to ${to} at ${totals[0]}, ${totals[1]}, or ${totals[2]}. These are planning estimates based on approximate straight-line distance between state centers, not quotes.`;
}
