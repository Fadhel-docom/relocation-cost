// Meta description for the route guides (state to state and city to city). Every figure comes
// from the same calculator run the page itself shows, so the description cannot disagree with
// the page. When a description would be too long for a search result, it drops the least
// important part instead of being cut in the middle of a number.
export const MAX_DESCRIPTION_LENGTH = 160;

const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

// totals: planning totals for the reference home (2–3 rooms), in the order DIY, rental truck +
// labor, full-service movers. benchmark: the published U-Haul one-way average for the distance band.
export function routeDescription({ from, to, miles, totals, benchmark }) {
  if (!Array.isArray(totals) || totals.length !== 3 || !totals.every(Number.isFinite)) {
    throw new TypeError("totals must be three finite numbers: DIY, truck + labor, full service.");
  }
  if (!Number.isFinite(benchmark)) throw new TypeError("benchmark must be a finite number.");
  const [diy, truck, full] = totals.map(money);
  const lead = `Moving ${from} to ${to}: about ${miles} miles.`;
  const totalsText = `Planning totals (2–3 rooms): ${diy} DIY, ${truck} truck + labor, ${full} full service.`;
  const candidates = [
    `${lead} ${totalsText} U-Haul one-way avg ${money(benchmark)}.`,
    `${lead} ${totalsText} U-Haul avg ${money(benchmark)}.`,
    `${lead} ${totalsText}`,
    `${lead} Planning totals: ${diy} DIY to ${full} full service.`,
  ];
  return candidates.find(text => text.length <= MAX_DESCRIPTION_LENGTH) ?? candidates[candidates.length - 1];
}

// Dollar amounts mentioned in a description, as written ("$1,615").
export function dollarAmounts(text) {
  return text.match(/\$\d+(?:,\d{3})*/g) ?? [];
}
