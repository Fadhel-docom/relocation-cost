// Expansion distance matrix builder (openrouteservice / HeiGIT, Standard plan).
// EXPERIMENTAL branch only. Not used by the site. Reads ORS_API_KEY from the environment and never prints it.
// Usage: node tools/expansion/ors-matrix.mjs <set>      (set = ca | uk | eu; reads data/expansion/cities-<set>.json)
// Self-test without network or key: ORS_SELFTEST=1 node tools/expansion/ors-matrix.mjs ca
import fs from 'node:fs';

const SET = process.argv[2] || 'ca';
const SELFTEST = process.env.ORS_SELFTEST === '1';
const KEY = process.env.ORS_API_KEY || '';
if (!SELFTEST && !KEY) { console.error('ORS_API_KEY is missing'); process.exit(1); }
const BASE = 'https://api.openrouteservice.org';
const PROFILE = 'driving-car';
const GAP_MS = SELFTEST ? 0 : 2000; // under the 40/min limit
const CHUNK = 20; // source rows per matrix request (keeps each request far below any per-request route cap)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const cfg = JSON.parse(fs.readFileSync(`data/expansion/cities-${SET}.json`, 'utf8'));
let requests = 0;
let lastRate = null;

function hav(a, b) {
  const R = 6371, rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b[1] - a[1]), dLon = rad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

async function call(path, body) {
  if (SELFTEST) return selftest(path, body);
  for (let attempt = 1; attempt <= 3; attempt++) {
    requests++;
    const res = await fetch(BASE + path, {
      method: 'POST',
      headers: { Authorization: KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    lastRate = { limit: res.headers.get('x-ratelimit-limit'), remaining: res.headers.get('x-ratelimit-remaining'), reset: res.headers.get('x-ratelimit-reset') };
    if (res.ok) { await sleep(GAP_MS); return JSON.parse(text); }
    if ((res.status === 429 || res.status >= 500) && attempt < 3) {
      const wait = Number(res.headers.get('retry-after')) || 30;
      console.error(`HTTP ${res.status} on ${path}; waiting ${wait}s (attempt ${attempt})`);
      await sleep(wait * 1000); continue;
    }
    return { __error: true, status: res.status, body: text.slice(0, 400) };
  }
}

function selftest(path, body) {
  if (path.startsWith('/v2/snap')) {
    return { locations: body.locations.map((l) => ({ location: l, snapped_distance: 10 })) };
  }
  const L = body.locations, src = body.sources || L.map((_, i) => i);
  const d = src.map((i) => L.map((l, j) => (i === j ? 0 : +(hav(L[i], l) * 1.2).toFixed(2))));
  return { distances: d, durations: d.map((r) => r.map((x) => Math.round(x * 40))), sources: src.map((i) => ({ location: L[i] })), destinations: L.map((l) => ({ location: l, snapped_distance: 10 })) };
}

async function runGroup(code, cities) {
  const out = { cities: cities.map((c) => ({ id: c.id, name: c.name, region: c.region, input: [c.lon, c.lat], ferry_or_island: !!c.ferry_or_island })), errors: [] };
  let coords = cities.map((c) => [c.lon, c.lat]);
  // 1) snap every model point to the nearest road node (radius 5 km) and record the distance
  const snap = await call(`/v2/snap/${PROFILE}`, { locations: coords, radius: 5000 });
  out.snap_status = snap.__error ? `unavailable (${snap.status}) ${snap.body || ''}` : 'ok';
  out.cities.forEach((c, i) => { c.snapped = null; c.snap_distance_m = null; });
  if (!snap.__error && Array.isArray(snap.locations)) {
    snap.locations.forEach((s, i) => {
      if (s && s.location) { out.cities[i].snapped = s.location; out.cities[i].snap_distance_m = Math.round(s.snapped_distance ?? 0); coords[i] = s.location; }
    });
  }
  // 2) distance + duration matrix, chunked by source rows
  const n = coords.length;
  const D = Array.from({ length: n }, () => Array(n).fill(null));
  const T = Array.from({ length: n }, () => Array(n).fill(null));
  for (let s = 0; s < n; s += CHUNK) {
    const idx = Array.from({ length: Math.min(CHUNK, n - s) }, (_, k) => s + k);
    const r = await call(`/v2/matrix/${PROFILE}`, { locations: coords, sources: idx, destinations: Array.from({ length: n }, (_, k) => k), metrics: ['distance', 'duration'], units: 'km', resolve_locations: true, ...(cfg.avoid_countries ? { options: { avoid_countries: cfg.avoid_countries } } : {}) });
    if (r.__error) { out.errors.push({ rows: idx, status: r.status, body: r.body }); continue; }
    idx.forEach((i, a) => { for (let j = 0; j < n; j++) { D[i][j] = r.distances[a][j]; T[i][j] = r.durations[a][j]; } });
    if (r.destinations) r.destinations.forEach((d, j) => { if (d && d.snapped_distance != null) out.cities[j].matrix_snap_m = Math.round(d.snapped_distance); });
  }
  out.km = D; out.seconds = T;
  // 3) quality checks computed from the result itself
  const ratios = [], bad = [], asym = [], nulls = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (i === j) continue;
    if (D[i][j] == null) { nulls.push([cities[i].id, cities[j].id]); continue; }
    const h = hav(coords[i], coords[j]);
    const q = h > 1 ? D[i][j] / h : null;
    if (q != null) { ratios.push(q); if (q < 1) bad.push({ from: cities[i].id, to: cities[j].id, km: D[i][j], straight_km: +h.toFixed(1), ratio: +q.toFixed(3), issue: 'road shorter than straight line' }); }
    if (i < j && D[j][i] != null) { const m = (D[i][j] + D[j][i]) / 2; const diff = Math.abs(D[i][j] - D[j][i]) / (m || 1); asym.push({ a: cities[i].id, b: cities[j].id, ab: D[i][j], ba: D[j][i], pct: +(diff * 100).toFixed(1) }); }
  }
  ratios.sort((a, b) => a - b);
  const pct = (p) => (ratios.length ? +ratios[Math.min(ratios.length - 1, Math.floor(p * ratios.length))].toFixed(3) : null);
  const high = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { if (D[i][j] == null) continue; const h = hav(coords[i], coords[j]); if (h > 1 && D[i][j] / h > 1.6) high.push({ a: cities[i].id, b: cities[j].id, km: D[i][j], straight_km: +h.toFixed(1), ratio: +(D[i][j] / h).toFixed(2) }); }
  asym.sort((a, b) => b.pct - a.pct);
  out.qa = { directed_pairs: n * (n - 1), null_pairs: nulls.length, null_list: nulls.slice(0, 50), ratio_p05: pct(0.05), ratio_median: pct(0.5), ratio_p95: pct(0.95), ratio_max: ratios.length ? +ratios[ratios.length - 1].toFixed(3) : null,
    road_shorter_than_straight: bad, pairs_ratio_above_1_6: high.slice(0, 80), asymmetry_over_3pct: asym.filter((x) => x.pct > 3).slice(0, 80), asymmetry_max_pct: asym.length ? asym[0].pct : null,
    snap_over_1km: out.cities.filter((c) => (c.snap_distance_m ?? 0) > 1000).map((c) => ({ id: c.id, m: c.snap_distance_m })) };
  return out;
}

const groups = cfg.groups;
const result = {
  metadata: {
    set: SET, generated_at: new Date().toISOString(), provider: 'openrouteservice by HeiGIT (Standard plan)', profile: PROFILE + ' (car, not a moving truck)',
    unit_distance: 'km', unit_duration: 'seconds', what_it_measures: 'driving distance between model points (city centres snapped to the nearest road), not between addresses',
    attribution: '© openrouteservice by HeiGIT | Data from OpenStreetMap', licence: 'CC-BY-SA 4.0 (results obtained from openrouteservice, per its Terms of Service read 2026-11-03)',
    licence_url: 'https://creativecommons.org/licenses/by-sa/4.0/', terms: 'https://account.heigit.org/info/tos', city_source: cfg.source || 'Natural Earth populated places (public domain)',
    selftest: SELFTEST, api_requests: 0, variant: cfg.variant || 'fastest', avoid_countries: cfg.avoid_countries || [], rate_limit_headers_last_response: null,
  },
  groups: {},
};
for (const [code, cities] of Object.entries(groups)) {
  console.log(`group ${code}: ${cities.length} cities`);
  result.groups[code] = await runGroup(code, cities);
  const q = result.groups[code].qa;
  console.log(`  snap ${result.groups[code].snap_status}; ratio median ${q.ratio_median}, max ${q.ratio_max}, nulls ${q.null_pairs}, asym max ${q.asymmetry_max_pct}%, errors ${result.groups[code].errors.length}`);
  for (const e of result.groups[code].errors) console.log('  matrix error', e.status, e.body);
}
result.metadata.api_requests = requests;
result.metadata.rate_limit_headers_last_response = lastRate;
console.log('rate-limit headers (last response):', JSON.stringify(lastRate));
fs.mkdirSync('data/expansion', { recursive: true });
const SUF = cfg.variant ? `-${cfg.variant}` : '';
fs.writeFileSync(`data/expansion/${SET}-road-matrix${SUF}.json`, JSON.stringify(result));
// long-format CSV (one row per directed pair)
const rows = ['group,from_id,to_id,km,minutes'];
for (const [code, g] of Object.entries(result.groups)) g.cities.forEach((a, i) => g.cities.forEach((b, j) => { if (i !== j && g.km[i][j] != null) rows.push(`${code},${a.id},${b.id},${g.km[i][j]},${Math.round(g.seconds[i][j] / 60)}`); }));
fs.writeFileSync(`data/expansion/${SET}-road-matrix${SUF}.csv`, rows.join('\n') + '\n');
console.log(`done: ${requests} API requests, ${rows.length - 1} directed pairs`);
