// BEA Regional Price Parities for metro areas: overall price level and the services: rents component.
// Neither is a mover quote or a household-specific forecast. The rent component is not a median rent.
import data from "../../data/cost-of-living.json" with { type: "json" };
import cityData from "../../data/cities.json" with { type: "json" };

export const SOURCE = data.source;
export const SLUGS = Object.freeze(Object.keys(data.cities));

export const CITIES = Object.freeze(
  Object.entries(data.cities)
    .map(([slug, city]) => Object.freeze({
      slug,
      name: cityData.cities[slug]?.name ?? slug,
      state: cityData.cities[slug]?.state ?? "",
      metro: city.metro,
      rpp: city.rpp,
      housingRpp: city.housingRpp,
    }))
    .sort((a, b) => a.rpp - b.rpp),
);

const find = slug => {
  const city = CITIES.find(item => item.slug === slug);
  if (!city) throw new RangeError("Unknown city: " + slug);
  return city;
};

export function compareCities(fromSlug, toSlug) {
  const from = find(fromSlug);
  const to = find(toSlug);
  const ratio = to.rpp / from.rpp;
  const percent = Math.round((ratio - 1) * 100);
  const housingRatio = to.housingRpp / from.housingRpp;
  const housingPercent = Math.round((housingRatio - 1) * 100);
  return {
    from, to, ratio, percent,
    housingRatio, housingPercent,
    direction: percent === 0 ? "same" : percent > 0 ? "higher" : "lower",
    housingDirection: housingPercent === 0 ? "same" : housingPercent > 0 ? "higher" : "lower",
  };
}

export function equivalentSpending(amount, ratio) {
  if (!Number.isFinite(amount) || amount < 0) throw new RangeError("Amount must be zero or more.");
  if (!Number.isFinite(ratio) || ratio <= 0) throw new RangeError("Ratio must be positive.");
  return Math.round(amount * ratio);
}

export function describeComparison(comparison) {
  const { from, to, percent, direction } = comparison;
  const index = "price index " + to.rpp.toFixed(1) + " vs " + from.rpp.toFixed(1) + ", U.S. average = 100";
  if (from.slug === to.slug) return "That is the same city (" + index + ").";
  if (direction === "same") return "Prices in " + to.name + " are about the same as in " + from.name + " (" + index + ").";
  return "Prices in " + to.name + " are about " + Math.abs(percent) + "% " + direction + " than in " + from.name + " (" + index + ").";
}

export function describeHousingComparison(comparison) {
  const { from, to, housingPercent, housingDirection } = comparison;
  const index = "rent component index " + to.housingRpp.toFixed(1) + " vs " + from.housingRpp.toFixed(1);
  if (from.slug === to.slug) return "The two selections are the same metro (" + index + ").";
  if (housingDirection === "same") return "The BEA housing-rent price component is about the same in " + to.name + " and " + from.name + " (" + index + ").";
  return "The BEA housing-rent price component is about " + Math.abs(housingPercent) + "% " + housingDirection + " in " + to.name + " than in " + from.name + " (" + index + ").";
}