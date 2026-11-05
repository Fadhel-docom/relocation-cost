// One-off test: does the Matrix endpoint accept options.avoid_borders at long range? (matrix quota only; ~3 requests)
import fs from 'node:fs';
const KEY = process.env.ORS_API_KEY || ''; if (!KEY) { console.error('ORS_API_KEY is missing'); process.exit(1); }
const M = JSON.parse(fs.readFileSync('data/expansion/ca-road-matrix.json', 'utf8')); const cs = M.groups.CA.cities;
const pick = (ids) => ids.map((id) => cs.find((c) => c.id === id)).filter(Boolean);
const sets = { small5: pick(['toronto-on', 'ottawa-on', 'montreal-qc', 'winnipeg-mb', 'vancouver-bc']), far4: pick(['vancouver-bc', 'calgary-ab', 'halifax-ns', 'saint-john-nb']) };
const out = { tests: [], note: 'matrix with options.avoid_borders; reference distances from the fastest matrix and the Directions home-only results' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [name, set] of Object.entries(sets)) for (const mode of ['all', 'controlled']) {
  const locs = set.map((c) => c.snapped || c.input);
  const res = await fetch('https://api.openrouteservice.org/v2/matrix/driving-car', { method: 'POST', headers: { Authorization: KEY, 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ locations: locs, metrics: ['distance'], units: 'km', options: { avoid_borders: mode } }) });
  const text = await res.text(); await sleep(2500);
  let rec = { set: name, mode, status: res.status, ids: set.map((c) => c.id) };
  if (res.ok) rec.km = JSON.parse(text).distances; else rec.error = text.slice(0, 300);
  console.log(name, mode, res.status, res.ok ? 'OK' : rec.error.slice(0, 160)); out.tests.push(rec);
}
fs.writeFileSync('data/expansion/avoid-borders-test.json', JSON.stringify(out));
