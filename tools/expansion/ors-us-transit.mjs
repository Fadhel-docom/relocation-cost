// US route transit check: does any of the 1,128 contiguous-state road routes cross Canada (or Mexico)?
// EXPERIMENTAL branch only. Two independent methods per route:
//   (A) openrouteservice "countryinfo" extra (which country ids the route passes through);
//   (B) the route geometry tested against Natural Earth 50m country polygons (public domain).
// Request body mirrors the production builder (src/lib/road-distance.js): raw state coordinates, radiuses [-1,-1].
// Resumable and quota-aware. Usage: node tools/expansion/ors-us-transit.mjs   (ORS_SELFTEST=1 tests the geometry code only)
import fs from 'node:fs';
import { execSync } from 'node:child_process';
const SELFTEST = process.env.ORS_SELFTEST === '1';
const KEY = process.env.ORS_API_KEY || '';
if (!SELFTEST && !KEY) { console.error('ORS_API_KEY is missing'); process.exit(1); }
const ID_CAN = 35, ID_MEX = 128, ID_USA = 214, M_PER_MILE = 1609.344;
const MAX_REQUESTS = Number(process.env.MAX_REQUESTS || 0); // Must be explicitly set after a fresh dashboard quota reading; this is NOT the remaining account quota.
if (!SELFTEST && (!Number.isInteger(MAX_REQUESTS) || MAX_REQUESTS < 1 || MAX_REQUESTS > 1300)) {
  console.error('Set MAX_REQUESTS to an explicit positive integer <= 1300 only after recording the current account-dashboard balance and the latest x-ratelimit-remaining, then reserving a safety margin. Do not infer the account quota from the public plan page (which lists up to 2,000/day) or from earlier runs that observed 200/day; neither establishes the current remaining balance. The per-run cap is a local safety ceiling, not the provider quota.');
  process.exit(1);
}
const START = Date.now(), MAX_MS = 100 * 60 * 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- polygons (Natural Earth 50m admin-0) with a latitude-bin edge index for fast point-in-polygon ----------
async function loadCountry(code) {
  const url = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_admin_0_countries.geojson';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Natural Earth download failed: HTTP ${res.status}`);
  const gj = await res.json();
  if (!Array.isArray(gj.features)) throw new Error('Natural Earth GeoJSON has no features array');
  const found = gj.features.filter((f) => ['CAN', 'MEX'].includes(f?.properties?.ADM0_A3) && f.geometry);
  const countries = found.reduce((acc, f) => { acc[f.properties.ADM0_A3] = f.geometry; return acc; }, {});
  for (const code of ['CAN', 'MEX']) if (!countries[code]) throw new Error(`Natural Earth GeoJSON is missing ${code}`);
  return countries;
}
const BIN = 0.1;
function indexGeometry(geom) {
  const polys = geom.type === 'MultiPolygon' ? geom.coordinates : [geom.coordinates];
  const bins = new Map(), edges = []; let minLat = 90, maxLat = -90;
  for (const poly of polys) for (const ring of poly) for (let i = 0; i < ring.length - 1; i++) {
    const edge = [ring[i][0], ring[i][1], ring[i + 1][0], ring[i + 1][1]];
    const [x1, y1, x2, y2] = edge, lo = Math.min(y1, y2), hi = Math.max(y1, y2);
    edges.push(edge); minLat = Math.min(minLat, lo); maxLat = Math.max(maxLat, hi);
    for (let b = Math.floor(lo / BIN); b <= Math.floor(hi / BIN); b++) { if (!bins.has(b)) bins.set(b, []); bins.get(b).push(edge); }
  }
  return { bins, edges, minLat, maxLat };
}
function inside(ix, lon, lat) {
  if (lat < ix.minLat || lat > ix.maxLat) return false;
  const edges = ix.bins.get(Math.floor(lat / BIN)); if (!edges) return false;
  let c = false;
  for (const [x1, y1, x2, y2] of edges) {
    // Treat polygon boundaries as outside: touching or following a border is not entering a country.
    const crossTrack = (lon - x1) * (y2 - y1) - (lat - y1) * (x2 - x1);
    if (Math.abs(crossTrack) <= 1e-10 && lon >= Math.min(x1, x2) - 1e-10 && lon <= Math.max(x1, x2) + 1e-10 &&
        lat >= Math.min(y1, y2) - 1e-10 && lat <= Math.max(y1, y2) + 1e-10) return false;
    if ((y1 > lat) !== (y2 > lat) && lon < ((x2 - x1) * (lat - y1)) / (y2 - y1) + x1) c = !c;
  }
  return c;
}
const hav = (a, b) => { const R = 6371, rad = (x) => (x * Math.PI) / 180, dl = rad(b[1] - a[1]), dn = rad(b[0] - a[0]); const h = Math.sin(dl / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
function crossings(ix, coords, minKm = 2) {
  // Split every route segment at polygon-boundary intersections, then classify each interval by its midpoint.
  // This detects a narrow country crossing even when both route vertices are outside the polygon.
  const segs = []; let cur = null;
  const cross = (ax, ay, bx, by) => ax * by - ay * bx;
  for (let i = 0; i < coords.length - 1; i++) {
    const a = coords[i], b = coords[i + 1], dx = b[0] - a[0], dy = b[1] - a[1];
    const lo = Math.min(a[1], b[1]), hi = Math.max(a[1], b[1]);
    const ts = [0, 1], seen = new Set();
    for (let bin = Math.floor(lo / BIN); bin <= Math.floor(hi / BIN); bin++) {
      for (const [cx, cy, ex, ey] of (ix.bins.get(bin) || [])) {
        const key = `${cx},${cy},${ex},${ey}`; if (seen.has(key)) continue; seen.add(key);
        const sx = ex - cx, sy = ey - cy, den = cross(dx, dy, sx, sy);
        if (Math.abs(den) < 1e-12) continue;
        const t = cross(cx - a[0], cy - a[1], sx, sy) / den;
        const u = cross(cx - a[0], cy - a[1], dx, dy) / den;
        if (t > 1e-10 && t < 1 - 1e-10 && u >= -1e-10 && u <= 1 + 1e-10) ts.push(t);
      }
    }
    ts.sort((x, y) => x - y);
    const unique = ts.filter((t, n) => n === 0 || t - ts[n - 1] > 1e-9);
    const lengthKm = hav(a, b);
    for (let j = 0; j < unique.length - 1; j++) {
      const t0 = unique[j], t1 = unique[j + 1], mid = (t0 + t1) / 2;
      const isIn = inside(ix, a[0] + dx * mid, a[1] + dy * mid);
      const p0 = [a[0] + dx * t0, a[1] + dy * t0], p1 = [a[0] + dx * t1, a[1] + dy * t1];
      if (isIn) {
        if (!cur) cur = { enter: [+p0[0].toFixed(5), +p0[1].toFixed(5)], km: 0, points: 0 };
        cur.km += lengthKm * (t1 - t0); cur.points++; cur.exit = [+p1[0].toFixed(5), +p1[1].toFixed(5)];
      } else if (cur) { segs.push(cur); cur = null; }
    }
  }
  if (cur) segs.push(cur);
  return segs.filter((s) => s.km >= minKm).map((s) => ({ ...s, km: +s.km.toFixed(1) }));
}

const countries = await loadCountry();
const IX = { CAN: indexGeometry(countries.CAN), MEX: indexGeometry(countries.MEX) };

if (SELFTEST) {
  const square = indexGeometry({ type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]] });
  const narrow = crossings(square, [[-1, 0.5], [2, 0.5]], 0);
  const holed = indexGeometry({ type: 'Polygon', coordinates: [[[0, 0], [4, 0], [4, 4], [0, 4], [0, 0]], [[1, 1], [3, 1], [3, 3], [1, 3], [1, 1]]] });
  const holeCross = crossings(holed, [[-1, 2], [5, 2]], 0);
  if (narrow.length !== 1 || narrow[0].km < 100 || holeCross.length !== 2) { console.error('segment intersection / polygon-hole tests FAILED', narrow, holeCross); process.exit(1); }
  // A route that only touches a polygon vertex or follows its outer edge must not be counted as entering it.
  const tangent = crossings(square, [[-1, 1], [0, 0], [-1, -1]], 0);
  const borderRide = crossings(square, [[-1, 0], [2, 0]], 0);
  const interior = crossings(square, [[0.2, 0.5], [0.8, 0.5]], 0);
  if (tangent.length !== 0 || borderRide.length !== 0 || interior.length !== 1) {
    console.error('boundary-touch / interior tests FAILED', { tangent, borderRide, interior }); process.exit(1);
  }
  console.log('vertex-only border touch: OK; outer-edge-only route: OK; route inside country: OK');
  console.log('narrow crossing between outside vertices: OK; polygon hole splits crossing: OK');
  const tests = [['Toronto', -79.38, 43.65, 'CAN', true], ['London ON', -81.25, 42.98, 'CAN', true], ['Winnipeg', -97.14, 49.9, 'CAN', true], ['Montreal', -73.57, 45.5, 'CAN', true], ['Detroit', -83.05, 42.33, 'CAN', false], ['Buffalo', -78.88, 42.89, 'CAN', false], ['Burlington VT', -73.21, 44.48, 'CAN', false], ['Seattle', -122.33, 47.61, 'CAN', false], ['Tijuana', -117.04, 32.51, 'MEX', true], ['San Diego', -117.16, 32.72, 'MEX', false], ['Austin', -97.74, 30.27, 'MEX', false]];
  let bad = 0; for (const [n, x, y, c, exp] of tests) { const got = inside(IX[c], x, y); if (got !== exp) bad++; console.log(n, c, got === exp ? 'OK' : 'WRONG'); }
  const route = [[-83.05, 42.33], [-82.5, 42.9], [-81.25, 42.98], [-79.9, 43.0], [-78.88, 42.89]];
  console.log('synthetic Detroit-Ontario-Buffalo route:', JSON.stringify(crossings(IX.CAN, route, 0)));
  console.log(bad === 0 ? 'SELFTEST PASSED' : 'SELFTEST FAILED'); process.exit(bad === 0 ? 0 : 1);
}

// ---------- inputs ----------
const states = JSON.parse(fs.readFileSync('data/state-distances.json', 'utf8')).states;
const prod = JSON.parse(execSync('git show origin/data/road-distances:data/road-distances.json', { maxBuffer: 1 << 28 }).toString()).pairs;
const OUT = 'data/expansion-us/us-transit-check.json';
fs.mkdirSync('data/expansion-us', { recursive: true });
let out = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { routes: {} };
out.metadata = { provider: 'openrouteservice by HeiGIT (Standard plan)', endpoint: 'v2/directions/driving-car/geojson', request_body: 'coordinates=[from.lon,from.lat],[to.lon,to.lat]; radiuses=[-1,-1]; extra_info=[countryinfo]; units=m (same points and radiuses as the production builder)', method_A: 'ORS countryinfo ids (Canada 35, Mexico 128, USA 214)', method_B: 'route geometry split at polygon-boundary intersections vs Natural Earth 50m polygons (CAN, MEX); segments shorter than 2 km ignored; geographic planar intersection is approximate', polygon_source: 'Natural Earth v5.1.2, geojson/ne_50m_admin_0_countries.geojson (release-pinned; public domain)', attribution: '© openrouteservice by HeiGIT | Data from OpenStreetMap', licence: 'CC-BY-SA 4.0', terms: 'https://account.heigit.org/info/tos' };
let requests = 0, quotaStop = false, lastRate = null, sinceSave = 0;
const save = () => { out.metadata.api_requests_this_run = requests; out.metadata.rate_limit_headers_last_response = lastRate; out.metadata.updated_at = new Date().toISOString(); fs.writeFileSync(OUT, JSON.stringify(out)); };
async function dir(from, to, avoid) {
  if (requests >= MAX_REQUESTS) { quotaStop = true; return { ok: false, quota: true, error: 'self-imposed cap ' + MAX_REQUESTS + ' reached' }; }
  for (let attempt = 1; attempt <= 3; attempt++) {
    if (requests >= MAX_REQUESTS) { quotaStop = true; return { ok: false, quota: true, error: 'explicit per-run MAX_REQUESTS cap reached' }; }
    requests++;
    const body = { coordinates: [[from.lon, from.lat], [to.lon, to.lat]], radiuses: [-1, -1], instructions: false, units: 'm', extra_info: ['countryinfo'] };
    if (avoid) body.options = { avoid_countries: avoid };
    let res, text;
    try {
      res = await fetch('https://api.heigit.org/openrouteservice/v2/directions/driving-car/geojson', { method: 'POST', headers: { Authorization: KEY, 'Content-Type': 'application/json', Accept: 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8' }, body: JSON.stringify(body) });
      text = await res.text();
    } catch (err) {
      return { ok: false, error: `network error: ${String(err).slice(0, 200)}` };
    }
    lastRate = { limit: res.headers.get('x-ratelimit-limit'), remaining: res.headers.get('x-ratelimit-remaining'), reset: res.headers.get('x-ratelimit-reset') };
    await sleep(2000);
    if (res.ok) {
      try {
        const payload = JSON.parse(text), f = payload?.features?.[0];
        if (!f?.properties?.summary || !Array.isArray(f?.geometry?.coordinates)) throw new Error('missing route summary or geometry');
        const vals = (f.properties.extras && f.properties.extras.countryinfo && f.properties.extras.countryinfo.values) || [];
        return { ok: true, miles: f.properties.summary.distance / M_PER_MILE, seconds: f.properties.summary.duration, ids: [...new Set(vals.map((v) => v[2]))], coords: f.geometry.coordinates };
      } catch (err) { return { ok: false, error: `invalid API JSON/GeoJSON: ${String(err).slice(0, 200)}` }; }
    }
    if (res.status === 403 && /quota/i.test(text)) { quotaStop = true; return { ok: false, quota: true, error: text.slice(0, 200) }; }
    if ((res.status === 429 || res.status >= 500) && attempt < 3) { await sleep((Number(res.headers.get('retry-after')) || 30) * 1000); continue; }
    return { ok: false, error: `${res.status} ${text.slice(0, 250)}` };
  }
}
// Heuristic priority (NOT an exclusion): pairs where a Canadian shortcut is geographically plausible go first, because the daily Directions quota is small.
const NORTH = new Set(['MI', 'WI', 'MN', 'ND', 'ME', 'VT', 'NH', 'NY', 'WA', 'ID', 'MT']);
const NEAR = new Set(['OH', 'PA', 'IN', 'IL', 'MA', 'CT', 'RI', 'NJ', 'SD', 'OR', 'WY', 'IA', 'NE']);
const tierOf = (p) => ((NORTH.has(p.from) && (NORTH.has(p.to) || NEAR.has(p.to))) || (NORTH.has(p.to) && NEAR.has(p.from))) ? 1 : (NORTH.has(p.from) || NORTH.has(p.to)) ? 2 : 3;
const keys = Object.entries(prod).filter(([, v]) => v.kind === 'state' && v.status === 'ok').map(([k, v]) => [k, tierOf(v)]).sort((a, b) => a[1] - b[1] || (a[0] < b[0] ? -1 : 1)).map(([k]) => k);
console.log('contiguous state pairs to check:', keys.length);
let consecFail = 0; // circuit breaker: stop after 5 failures in a row so a systematic error cannot burn the daily quota (2026-11-06: 1,128 requests all failed with 406)
outer: for (const key of keys) {
  if (quotaStop || Date.now() - START > MAX_MS) break;
  if (out.routes[key] && out.routes[key].status === 'ok') continue;
  const p = prod[key], A = states[p.from], B = states[p.to];
  const r = await dir(A, B); if (r.quota) break outer;
  if (!r.ok) { out.routes[key] = { status: 'failed', error: r.error, unresolved: true }; save(); consecFail++; if (consecFail >= 5) { console.error('Stopping: 5 consecutive failures. Last error: ' + String(r.error).slice(0, 300)); break outer; } continue; }
  consecFail = 0;
  const can = crossings(IX.CAN, r.coords), mex = crossings(IX.MEX, r.coords);
  const rec = { status: 'ok', tier: tierOf(p), from: p.from, to: p.to, stored_miles: p.roadMiles, rerun_miles: +r.miles.toFixed(1), rerun_diff_pct: +(Math.abs(r.miles - p.roadMiles) / p.roadMiles * 100).toFixed(2), route_points: r.coords.length, ors_country_ids: r.ids,
    A_canada: r.ids.includes(ID_CAN), A_mexico: r.ids.includes(ID_MEX), B_canada_segments: can, B_canada_km: +can.reduce((s, x) => s + x.km, 0).toFixed(1), B_mexico_segments: mex, B_mexico_km: +mex.reduce((s, x) => s + x.km, 0).toFixed(1) };
  rec.affected = rec.A_canada || rec.A_mexico || can.length > 0 || mex.length > 0;
  rec.methods_agree = (rec.A_canada === (can.length > 0)) && (rec.A_mexico === (mex.length > 0));
  if (rec.affected) { // US-only alternative: ask the same pair again while avoiding Canada and Mexico
    const alt = await dir(A, B, [ID_CAN, ID_MEX]); if (alt.quota) { out.routes[key] = rec; break outer; }
    rec.alternative = alt.ok ? { miles: +alt.miles.toFixed(1), delta_miles: +(alt.miles - r.miles).toFixed(1), delta_pct: +((alt.miles - r.miles) / r.miles * 100).toFixed(2), ors_country_ids: alt.ids, still_foreign: alt.ids.filter((x) => x !== ID_USA && x !== 0), polygon_canada_km: +crossings(IX.CAN, alt.coords).reduce((s, x) => s + x.km, 0).toFixed(1) } : { error: alt.error };
  }
  out.routes[key] = rec;
  if (++sinceSave >= 5) { save(); sinceSave = 0; console.log(`progress ${Object.keys(out.routes).length}/${keys.length}, requests ${requests}`); }
}
const all = Object.values(out.routes), ok = all.filter((x) => x.status === 'ok'), aff = ok.filter((x) => x.affected);
const tiers = {}; for (const x of ok) { tiers[x.tier] = (tiers[x.tier] || 0) + 1; }
out.summary = { checked_by_tier: tiers, total: keys.length, checked_ok: ok.length, failed_unresolved: all.filter((x) => x.status !== 'ok').length, remaining: keys.length - ok.length, complete: ok.length === keys.length, affected: aff.length, affected_by_ors_canada: ok.filter((x) => x.A_canada).length, affected_by_polygon_canada: ok.filter((x) => x.B_canada_segments.length).length, affected_by_mexico: ok.filter((x) => x.A_mexico || x.B_mexico_segments.length).length,
  methods_disagree: ok.filter((x) => !x.methods_agree).length, rerun_diff_over_1pct: ok.filter((x) => x.rerun_diff_pct > 1).length, rerun_diff_max_pct: ok.length ? Math.max(...ok.map((x) => x.rerun_diff_pct)) : null, alternatives_found: aff.filter((x) => x.alternative && x.alternative.miles).length, alternatives_failed: aff.filter((x) => x.alternative && x.alternative.error).length, quota_stop: quotaStop, run_minutes: +((Date.now() - START) / 60000).toFixed(1) };
save();
const rows = ['from,to,stored_miles,rerun_miles,ors_canada,polygon_canada_km,mexico,alt_miles,alt_delta_pct'];
for (const x of aff) rows.push([x.from, x.to, x.stored_miles, x.rerun_miles, x.A_canada, x.B_canada_km, x.A_mexico || x.B_mexico_segments.length > 0, x.alternative?.miles ?? '', x.alternative?.delta_pct ?? ''].join(','));
fs.writeFileSync('data/expansion-us/us-transit-affected.csv', rows.join('\n') + '\n');
console.log(JSON.stringify(out.summary), 'rate headers:', JSON.stringify(lastRate));
