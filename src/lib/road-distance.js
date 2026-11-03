// Helpers for building a static table of road distances between the calculator's state points
// and city points. Pure functions only: no network, no file access. The command-line tool
// (tools/road-distances-build.mjs) does the requests; these functions decide what to ask,
// read the answers and sanity-check them.

export const METERS_PER_MILE = 1609.344;
const EARTH_RADIUS_MILES = 3958.7613; // same radius as the straight-line formula in the calculator
// ORS directions refuse routes longer than about 6,000 km; those pairs stay straight-line.
export const NO_ROAD_STATES = new Set(["HI"]); // no road connection to the other states

const toRadians = degrees => degrees * Math.PI / 180;

export function straightLineMiles(a, b) {
  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function metersToMiles(meters) {
  if (!Number.isFinite(meters) || meters < 0) throw new Error(`Invalid distance in meters: ${meters}`);
  return Math.round((meters / METERS_PER_MILE) * 10) / 10;
}

// One key per unordered pair, codes sorted so A-B and B-A share an entry.
export function pairKey(a, b) {
  return [a, b].sort().join("|");
}

export function buildStatePairs(states) {
  const codes = Object.keys(states).filter(code => !NO_ROAD_STATES.has(code)).sort();
  const pairs = [];
  for (let i = 0; i < codes.length; i += 1) {
    for (let j = i + 1; j < codes.length; j += 1) {
      pairs.push({ kind: "state", key: pairKey(codes[i], codes[j]), from: codes[i], to: codes[j] });
    }
  }
  return pairs;
}

// The route list already holds one entry per city pair (both directions share a page).
export function buildCityPairs(routes) {
  const seen = new Set();
  const pairs = [];
  for (const { from, to } of routes) {
    const key = pairKey(from, to);
    if (seen.has(key)) continue;
    seen.add(key);
    const [a, b] = [from, to].sort();
    pairs.push({ kind: "city", key, from: a, to: b });
  }
  return pairs;
}

export function pointFor(pair, stateData, cityData) {
  const source = pair.kind === "state" ? stateData.states : cityData.cities;
  const from = source[pair.from];
  const to = source[pair.to];
  if (!from || !to) throw new Error(`Unknown point for pair ${pair.key}`);
  return { from, to };
}

// Body for POST {host}/openrouteservice/v2/directions/driving-car/json
// radiuses -1 = snap to the nearest road at any distance (state points are not on a road).
export function buildDirectionsBody(from, to) {
  return {
    coordinates: [[from.lon, from.lat], [to.lon, to.lat]],
    radiuses: [-1, -1],
    geometry: false,
    instructions: false,
    units: "m"
  };
}

export function parseDirections(json) {
  const meters = json?.routes?.[0]?.summary?.distance;
  if (typeof meters !== "number") return { ok: false, reason: "no_route_in_response" };
  return { ok: true, meters };
}

// A road can never be shorter than the straight line between the same points, and a ratio far
// above what real road networks give means the point snapped somewhere odd. Flag, never hide.
export function checkRatio(roadMiles, straightMiles) {
  if (!(straightMiles > 0)) return { ok: false, flag: "no_straight_line" };
  const ratio = roadMiles / straightMiles;
  if (ratio < 0.98) return { ok: false, flag: "shorter_than_straight_line", ratio };
  if (ratio > 2.2) return { ok: true, flag: "ratio_above_2_2_review", ratio };
  return { ok: true, flag: null, ratio };
}

export function makeEntry(pair, roadMiles, straightMiles, requestedAt) {
  const check = checkRatio(roadMiles, straightMiles);
  return {
    kind: pair.kind,
    from: pair.from,
    to: pair.to,
    roadMiles,
    straightMiles: Math.round(straightMiles * 10) / 10,
    ratio: Math.round(check.ratio * 1000) / 1000,
    status: check.ok ? "ok" : "rejected",
    flag: check.flag,
    requestedAt
  };
}

export function makeFailure(pair, reason, requestedAt) {
  return { kind: pair.kind, from: pair.from, to: pair.to, status: "failed", reason, requestedAt };
}

// Pairs still to ask: no entry yet, or an earlier failure that is worth retrying.
export function pendingPairs(pairs, table, { retryFailed = false } = {}) {
  return pairs.filter(pair => {
    const entry = table[pair.key];
    if (!entry) return true;
    return retryFailed && entry.status === "failed" && (entry.reason?.startsWith("network_") || /^http_(429|5\d\d)/.test(entry.reason ?? ""));
  });
}

export function summarize(table) {
  const counts = { ok: 0, rejected: 0, failed: 0, flagged: 0 };
  for (const entry of Object.values(table)) {
    counts[entry.status] = (counts[entry.status] ?? 0) + 1;
    if (entry.flag && entry.status === "ok") counts.flagged += 1;
  }
  return counts;
}

export const DATASET_METADATA = {
  schema_version: "1.0",
  unit: "miles",
  source: "openrouteservice (HeiGIT), driving-car profile, directions endpoint",
  data_licence: "CC-BY-SA 4.0 (results obtained from openrouteservice, per the HeiGIT Terms of Service); underlying map data: © OpenStreetMap contributors (ODbL 1.0)",
  licence_url: "https://creativecommons.org/licenses/by-sa/4.0/",
  attribution: "© openrouteservice by HeiGIT | Data from OpenStreetMap",
  terms: "https://account.heigit.org/info/tos",
  note: "Planning input only. Distance between the same state or city points the calculator uses for its straight-line distance, snapped to the nearest road. Not a quote and not a navigation route."
};
