// Submit all sitemap URLs of the live site to IndexNow (Bing, Yandex, Naver, Seznam, Yep).
// Not used by Google. Usage: node tools/indexnow-submit.mjs
import fs from "node:fs";

const HOST = "relocation-cost-psi.vercel.app";
const ORIGIN = `https://${HOST}`;
const keyFile = fs.readdirSync("public").find(f => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("IndexNow key file not found in public/");
const key = keyFile.replace(".txt", "");
const keyLocation = `${ORIGIN}/${keyFile}`;

const keyRes = await fetch(keyLocation);
const keyBody = (await keyRes.text()).trim();
if (!keyRes.ok || keyBody !== key) {
  throw new Error(`Key file not live yet at ${keyLocation} (status ${keyRes.status})`);
}

const sitemap = await (await fetch(`${ORIGIN}/sitemap-0.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
if (urlList.length < 50) throw new Error(`Unexpected sitemap size: ${urlList.length}`);

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs, HTTP ${res.status}`);
if (res.status !== 200 && res.status !== 202) {
  throw new Error(`IndexNow rejected the submission: ${res.status} ${await res.text()}`);
}
