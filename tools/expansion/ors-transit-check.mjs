// Transit check: which flagged pairs route through another country, and what is the distance that stays inside the home country?
// EXPERIMENTAL branch only. Usage: node tools/expansion/ors-transit-check.mjs <set> <homeCountryId> <avoidCountryIds comma-separated>
// Country ids come from https://giscience.github.io/openrouteservice/technical-details/country-list (Canada 35, United States of America 214).
import fs from 'node:fs';
const SET = process.argv[2] || 'ca';
const HOME = Number(process.argv[3] || 35);
const AVOID = (process.argv[4] || '214').split(',').map(Number);
const KEY = process.env.ORS_API_KEY || '';
if (!KEY) { console.error('ORS_API_KEY is missing'); process.exit(1); }
const M = JSON.parse(fs.readFileSync(`data/expansion/${SET}-road-matrix.json`, 'utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let requests = 0;
async function dir(coords, options) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    requests++;
    const body = { coordinates: coords, units: 'km', extra_info: ['countryinfo'], instructions: false };
    if (options) body.options = options;
    const res = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', { method: 'POST', headers: { Authorization: KEY, 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
    const text = await res.text();
    await sleep(2000);
    if (res.ok) return JSON.parse(text);
    if ((res.status === 429 || res.status >= 500) && attempt < 3) { await sleep((Number(res.headers.get('retry-after')) || 30) * 1000); continue; }
    return { __error: true, status: res.status, body: text.slice(0, 300) };
  }
}
const out = { metadata: { set: SET, generated_at: new Date().toISOString(), home_country_id: HOME, avoid_country_ids: AVOID, note: 'default = fastest route as the matrix computes it; home_only = same request with options.avoid_countries' }, groups: {} };
for (const [code, g] of Object.entries(M.groups)) {
  const n = g.cities.length, pts = g.cities.map((c) => c.snapped || c.input);
  const flagged = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const a = g.km[i][j], b = g.km[j][i]; if (a == null || b == null) continue;
    if (Math.abs(a - b) / ((a + b) / 2) > 0.03) flagged.push([i, j]);
  }
  console.log(`group ${code}: ${flagged.length} flagged pairs (asymmetry > 3%)`);
  const rows = [];
  for (const [i, j] of flagged) for (const [s, t] of [[i, j], [j, i]]) {
    const r = await dir([pts[s], pts[t]]);
    const row = { from: g.cities[s].id, to: g.cities[t].id, matrix_km: g.km[s][t] };
    if (r.__error) { row.default_error = `${r.status} ${r.body}`; rows.push(row); continue; }
    const rt = r.routes[0]; row.default_km = +rt.summary.distance.toFixed(2);
    const vals = (rt.extras && rt.extras.countryinfo && rt.extras.countryinfo.values) || [];
    const ids = [...new Set(vals.map((v) => v[2]))]; row.country_ids = ids; row.via_other_country = ids.some((x) => x !== HOME && x !== 0);
    if (row.via_other_country) {
      const r2 = await dir([pts[s], pts[t]], { avoid_countries: AVOID });
      if (r2.__error) row.home_only_error = `${r2.status} ${r2.body}`; else row.home_only_km = +r2.routes[0].summary.distance.toFixed(2);
    }
    rows.push(row);
  }
  out.groups[code] = { flagged_pairs: flagged.length, rows };
  const via = rows.filter((r) => r.via_other_country).length;
  console.log(`  directed routes checked ${rows.length}; passing through another country: ${via}`);
}
out.metadata.api_requests = requests;
fs.writeFileSync(`data/expansion/${SET}-transit-check.json`, JSON.stringify(out));
console.log('done, requests:', requests);
