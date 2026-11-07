// Lookup for the precomputed road-distance table (data/road-distances.json).
// Pure functions: the table is passed in, so pages, the browser script and tests share one rule.
// A pair missing from the table (Alaska, Hawaii, anything that failed) falls back to the
// straight-line distance and says so, so no caller ever treats a fallback as road mileage.
import { pairKey, straightLineMiles } from "./road-distance.js";

// kind: "state" or "city". a and b are codes (states) or slugs (cities); order does not matter.
// pointA and pointB ({ lat, lon }) are only used for the straight-line fallback.
export function distanceFor(table, kind, a, b, pointA, pointB) {
  if (kind !== "state" && kind !== "city") throw new TypeError(`Unknown kind: ${kind}`);
  if (!a || !b || a === b) return null;
  const entry = table?.pairs?.[pairKey(a, b)];
  if (entry && Number.isFinite(entry.road) && entry.road > 0) {
    return { miles: Math.round(entry.road), basis: "road" };
  }
  if (!pointA || !pointB) return null;
  return { miles: Math.round(straightLineMiles(pointA, pointB)), basis: "straight" };
}
