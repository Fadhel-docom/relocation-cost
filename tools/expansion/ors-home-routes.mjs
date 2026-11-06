// Home-country-only road routes between every pair of model cities (openrouteservice Directions).
// EXPERIMENTAL branch only. Resumable: pairs already computed are kept; stops cleanly when the daily quota is exhausted.
// Usage: node tools/expansion/ors-home-routes.mjs <set> <homeCountryId> <avoidCountryIds> [hubCityId]
// Country ids: https://giscience.github.io/openrouteservice/technical-details/country-list (Canada 35, United States of America 214).
import fs from 'node:fs';
const SET = process.argv[2] || 'ca';
const HOME = Number(process.argv[3] || 35);
const AVOID = (process.argv[4] || '214').split(',').map(Number);
const HUB = process.argv[5] || '';
const KEY = process.env.ORS_API_KEY || '';
if (!KEY) { console.error('ORS_API_KEY is missing'); process.exit(1); }
const MAX_REQUESTS = Number(process.env.MAX_REQUESTS || 290); // self-imposed cap per run. 2026-11-06: api.heigit.org reports x-ratelimit-limit=2000 (remaining 1810 after 190 requests); the 200/day cap seen on 11-03 and 11-05 came from the deprecated host api.openrouteservice.org
const START = Date.now(), MAX_MS = 100 * 60 * 1000;
const M = JSON.parse(fs.readFileSync(`data/expansion/${SET}-road-matrix.json`, 'utf8'));
const gk = Object.keys(M.groups)[0];
const cities = M.groups[gk].cities, n = cities.length;
const pts = cities.map((c) => c.snapped || c.input);
const OUT = `data/expansion/${SET}-home-routes.json`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let out = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { routes: {}, reverse_sample: {} };
out.metadata = { set: SET, provider: 'openrouteservice by HeiGIT (Standard plan)', endpoint: 'v2/directions/driving-car', profile: 'driving-car (car, not a moving truck)', routing: `options.avoid_countries=${JSON.stringify(AVOID)}; countryinfo checked per route (home id ${HOME})`, hub_for_over_cap: HUB || null,
  attribution: '© openrouteservice by HeiGIT | Data from OpenStreetMap', licence: 'CC-BY-SA 4.0 (results obtained from openrouteservice)', terms: 'https://account.heigit.org/info/tos', unit_distance: 'km', unit_duration: 'seconds', cities: cities.map((c) => c.id) };
let requests = 0, quotaStop = false, lastRate = null, sinceSave = 0;
const save = () => { out.metadata.api_requests_this_run = requests; out.metadata.rate_limit_headers_last_response = lastRate; out.metadata.updated_at = new Date().toISOString(); fs.writeFileSync(OUT, JSON.stringify(out)); };
async function dir(a, b, avoid = true) {
  if (requests >= MAX_REQUESTS) { quotaStop = true; return { ok: false, quota: true, error: 'self-imposed cap ' + MAX_REQUESTS + ' reached' }; }
  for (let attempt = 1; attempt <= 3; attempt++) {
    requests++;
    const body = { coordinates: [a, b], units: 'km', instructions: false, extra_info: ['countryinfo'] };
    if (avoid) body.options = { avoid_countries: AVOID };
    const res = await fetch('https://api.heigit.org/openrouteservice/v2/directions/driving-car', { method: 'POST', headers: { Authorization: KEY, 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
    const text = await res.text();
    lastRate = { limit: res.headers.get('x-ratelimit-limit'), remaining: res.headers.get('x-ratelimit-remaining'), reset: res.headers.get('x-ratelimit-reset') };
    await sleep(2000);
    if (res.ok) {
      const rt = JSON.parse(text).routes[0];
      const vals = (rt.extras && rt.extras.countryinfo && rt.extras.countryinfo.values) || [];
      const ids = [...new Set(vals.map((v) => v[2]))];
      return { ok: true, km: +rt.summary.distance.toFixed(2), seconds: Math.round(rt.summary.duration), country_ids: ids, foreign: ids.filter((x) => x !== HOME && x !== 0) };
    }
    if (res.status === 403 && /quota/i.test(text)) { quotaStop = true; return { ok: false, quota: true, error: text.slice(0, 200) }; }
    if ((res.status === 429 || res.status >= 500) && attempt < 3) { await sleep((Number(res.headers.get('retry-after')) || 30) * 1000); continue; }
    return { ok: false, status: res.status, error: text.slice(0, 300) };
  }
}
const hub = HUB ? cities.findIndex((c) => c.id === HUB) : -1;
outer: for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
  if (quotaStop || Date.now() - START > MAX_MS) break outer;
  const key = `${cities[i].id}|${cities[j].id}`;
  if (out.routes[key] && out.routes[key].status === 'ok') continue;
  let r = await dir(pts[i], pts[j]);
  let rec;
  if (r.quota) break outer;
  if (r.ok) rec = { status: 'ok', method: 'direct', km: r.km, seconds: r.seconds, country_ids: r.country_ids, foreign_ids: r.foreign };
  else if (/2004|exceed/i.test(r.error || '') && hub >= 0 && hub !== i && hub !== j) {
    const r1 = await dir(pts[i], pts[hub]); if (r1.quota) break outer; const r2 = r1.ok ? await dir(pts[hub], pts[j]) : r1; if (r2.quota) break outer;
    rec = r1.ok && r2.ok ? { status: 'ok', method: 'via-hub:' + HUB, km: +(r1.km + r2.km).toFixed(2), seconds: r1.seconds + r2.seconds, country_ids: [...new Set([...r1.country_ids, ...r2.country_ids])], foreign_ids: [...new Set([...r1.foreign, ...r2.foreign])], first_error: r.error.slice(0, 120) } : { status: 'failed', error: (r1.ok ? r2.error : r1.error), first_error: r.error.slice(0, 120) };
  } else rec = { status: 'failed', http: r.status, error: r.error };
  out.routes[key] = rec;
  if (++sinceSave >= 25) { save(); sinceSave = 0; console.log(`progress ${Object.keys(out.routes).length}/${n * (n - 1) / 2}, requests ${requests}`); }
}
// reverse-direction sample (every 16th computed direct route) to measure asymmetry of the home-only routing
if (!quotaStop && Date.now() - START < MAX_MS) {
  let k = 0;
  for (const [key, v] of Object.entries(out.routes)) {
    if (v.status !== 'ok' || v.method !== 'direct') continue;
    if (k++ % 16 !== 0 || out.reverse_sample[key]) continue;
    if (quotaStop || Date.now() - START > MAX_MS) break;
    const [a, b] = key.split('|'); const r = await dir(pts[cities.findIndex((c) => c.id === b)], pts[cities.findIndex((c) => c.id === a)]);
    if (r.quota) break;
    if (r.ok) out.reverse_sample[key] = { forward_km: v.km, reverse_km: r.km, diff_pct: +(Math.abs(v.km - r.km) / ((v.km + r.km) / 2) * 100).toFixed(2), reverse_foreign_ids: r.foreign };
  }
}
// summary + checks
const hav = (a, b) => { const R = 6371, rad = (x) => x * Math.PI / 180, dl = rad(b[1] - a[1]), dn = rad(b[0] - a[0]); const h = Math.sin(dl / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
const entries = Object.entries(out.routes), ok = entries.filter(([, v]) => v.status === 'ok');
const ratios = ok.map(([k, v]) => { const [a, b] = k.split('|'); const h = hav(pts[cities.findIndex((c) => c.id === a)], pts[cities.findIndex((c) => c.id === b)]); return h > 1 ? v.km / h : null; }).filter((x) => x != null).sort((x, y) => x - y);
const rs = Object.values(out.reverse_sample);
out.summary = { total_pairs: n * (n - 1) / 2, computed_ok: ok.length, failed: entries.length - ok.length, remaining: n * (n - 1) / 2 - ok.length, complete: ok.length === n * (n - 1) / 2, via_hub: ok.filter(([, v]) => v.method !== 'direct').length, routes_touching_foreign_country: ok.filter(([, v]) => v.foreign_ids && v.foreign_ids.length).length,
  road_shorter_than_straight: ratios.filter((x) => x < 1).length, ratio_median: ratios.length ? +ratios[Math.floor(ratios.length / 2)].toFixed(3) : null, ratio_max: ratios.length ? +ratios[ratios.length - 1].toFixed(3) : null,
  reverse_sample_n: rs.length, reverse_max_diff_pct: rs.length ? Math.max(...rs.map((x) => x.diff_pct)) : null, quota_stop: quotaStop, run_minutes: +((Date.now() - START) / 60000).toFixed(1) };
save();
const rows = ['from_id,to_id,km,minutes,method'];
for (const [k, v] of ok) { const [a, b] = k.split('|'); rows.push(`${a},${b},${v.km},${Math.round(v.seconds / 60)},${v.method}`); }
fs.writeFileSync(`data/expansion/${SET}-home-routes.csv`, rows.join('\n') + '\n');
console.log(JSON.stringify(out.summary), 'rate headers:', JSON.stringify(lastRate));
