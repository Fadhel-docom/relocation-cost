// Price-level comparison between two of the calculator's cities, from one official table: the Bureau of
// Economic Analysis "Regional Price Parities" (RPP) for metropolitan areas, all items, U.S. average = 100.
// It compares the average consumer's basket of goods and services between areas; it is not a quote, not a
// forecast and not a figure for one household. No other number is mixed in.
import data from "../../data/cost-of-living.json" with { type: "json" };
import cityData from "../../data/cities.json" with { type: "json" };

export const SOURCE = data.source;
export const SLUGS = Object.freeze(Object.keys(data.cities));

// Cities from the lowest to the highest price level (ties keep the data order).
export const CITIES = Object.freeze(
  Object.entries(data.cities)
    .map(([slug, city]) => Object.freeze({ slug, name: cityData.cities[slug]?.name ?? slug, state: cityData.cities[slug]?.state ?? "", metro: city.metro, rpp: city.rpp }))
    .sort((a, b) => a.rpp - b.rpp),
);

const find = slug => {
  const city = CITIES.find(item => item.slug === slug);
  if (!city) throw new RangeError(`Unknown city: ${slug}`);
  return city;
};

// How prices in `to` compare with prices in `from`, in whole percent. direction is "same" when the
// whole-percent difference is zero, so a 0.4% gap is never described as higher or lower.
export function compareCities(fromSlug, toSlug) {
  const from = find(fromSlug);
  const to = find(toSlug);
  const ratio = to.rpp / from.rpp;
  const percent = Math.round((ratio - 1) * 100);
  return { from, to, ratio, percent, direction: percent === 0 ? "same" : percent > 0 ? "higher" : "lower" };
}

// What the same average basket would cost in the other city, rounded to a whole dollar.
export function equivalentSpending(amount, ratio) {
  if (!Number.isFinite(amount) || amount < 0) throw new RangeError("Amount must be zero or more.");
  if (!Number.isFinite(ratio) || ratio <= 0) throw new RangeError("Ratio must be positive.");
  return Math.round(amount * ratio);
}

// One sentence for the result, with the numbers behind it.
export function describeComparison(comparison) {
  const { from, to, percent, direction } = comparison;
  const index = `price index ${to.rpp.toFixed(1)} vs ${from.rpp.toFixed(1)}, U.S. average = 100`;
  if (from.slug === to.slug) return `That is the same city (${index}).`;
  if (direction === "same") return `Prices in ${to.name} are about the same as in ${from.name} (${index}).`;
  return `Prices in ${to.name} are about ${Math.abs(percent)}% ${direction} than in ${from.name} (${index}).`;
}
