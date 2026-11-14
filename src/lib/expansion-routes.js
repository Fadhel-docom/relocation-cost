// Pure helpers for tools/expansion/home-routes.mjs (country-by-country road distances, kept OFF the site).
// No network here: the tool asks openrouteservice, these functions build pairs and read countryinfo answers.

export const FOREIGN_MIN_KM = 1; // a shorter touch of another country is a border artefact, recorded but not "foreign"

export function buildPairs(cities) {
  const pairs = [];
  for (let i = 0; i < cities.length; i += 1) {
    for (let j = i + 1; j < cities.length; j += 1) pairs.push({ key: `${cities[i].id}|${cities[j].id}`, i, j });
  }
  return pairs;
}

// routes[0].extras.countryinfo.summary = [{ value: countryId, distance: km, amount: percent }]
export function readCountries(json) {
  const summary = json?.routes?.[0]?.extras?.countryinfo?.summary;
  if (!Array.isArray(summary)) return { available: false, ids: [], longestId: null, touches: [] };
  const positive = summary.filter(row => row.distance > 0);
  const longest = [...positive].sort((a, b) => b.distance - a.distance)[0];
  return {
    available: true,
    ids: [...new Set(positive.map(row => row.value))],
    longestId: longest ? longest.value : null,
    touches: positive.map(row => ({ id: row.value, km: Math.round(row.distance * 10) / 10 }))
  };
}

// Foreign = a known country (id above 0) other than home with at least FOREIGN_MIN_KM on the route.
export function foreignIds(countries, homeId) {
  return countries.touches.filter(row => row.id !== homeId && row.id > 0 && row.km >= FOREIGN_MIN_KM).map(row => row.id);
}

export function ratioFlag(km, straightKm) {
  if (!(straightKm > 0)) return "no_straight_line";
  const ratio = km / straightKm;
  if (ratio < 0.98) return "shorter_than_straight_line";
  if (ratio > 2.2) return "ratio_above_2_2_review";
  return null;
}
