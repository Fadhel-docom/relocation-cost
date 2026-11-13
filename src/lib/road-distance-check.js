// Pure helpers for tools/road-distances-check.mjs (two read-only audits of data/road-distances.json).
// No network here: the tool asks openrouteservice, these functions only choose pairs and judge answers.

export const US_COUNTRY_ID = 214; // openrouteservice countryinfo id for the United States
export const REVERSE_FLAG_PERCENT = 3; // a gap above this between the two directions is reported, never hidden

// A deterministic spread over the sorted keys, so a rerun asks for the same pairs.
export function sampleEvenly(keys, count) {
  const sorted = [...keys].sort();
  if (!(count > 0) || sorted.length === 0) return [];
  if (count >= sorted.length) return sorted;
  return Array.from({ length: count }, (_, index) => sorted[Math.floor((index * sorted.length) / count)]);
}

// Reads routes[0].extras.countryinfo.summary. Returns available:false when the extra is missing so the
// caller can stop after one request instead of spending the whole quota on empty answers.
export function summarizeCountries(json) {
  const summary = json?.routes?.[0]?.extras?.countryinfo?.summary;
  if (!Array.isArray(summary)) return { available: false, onlyUs: false, other: [] };
  const other = summary.filter(row => row.value !== US_COUNTRY_ID && row.distance > 0)
    .map(row => ({ id: row.value, meters: Math.round(row.distance) }));
  return { available: true, onlyUs: other.length === 0, other };
}

export function compareDirections(storedMiles, reverseMiles) {
  const diffMiles = Math.round((reverseMiles - storedMiles) * 10) / 10;
  const diffPercent = Math.round(((reverseMiles - storedMiles) / storedMiles) * 1000) / 10;
  return { diffMiles, diffPercent, flagged: Math.abs(diffPercent) > REVERSE_FLAG_PERCENT };
}

export function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : Math.round(((sorted[middle - 1] + sorted[middle]) / 2) * 10) / 10;
}
