import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const failures = [];
const expectedStatic = new Set([
  "/",
  "/calculator/",
  "/about/",
  "/privacy/",
  "/disclosure/",
  "/methodology/",
  "/contact/",
  "/moving-cost/",
  "/moving-cost/cities/",
  "/guides/moving-cost/",
  "/guides/relocation-budget/",
  "/guides/diy-vs-movers/"
]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function htmlFiles() {
  return walk(dist).filter(file => file.endsWith(".html"));
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

const pages = htmlFiles();
const canonicalByPage = new Map();
const internalTargets = new Map();
const guidePaths = ["/guides/moving-cost/", "/guides/diy-vs-movers/", "/guides/relocation-budget/"];

for (const file of pages) {
  const html = read(file);
  const rel = path.relative(dist, file);
  const h1Count = (html.match(/<h1\b[^>]*>/gi) ?? []).length;
  const titleCount = (html.match(/<title\b[^>]*>/gi) ?? []).length;
  const descriptionCount = (html.match(/<meta\b[^>]*name=["']description["'][^>]*>/gi) ?? []).length;

  if (h1Count !== 1) failures.push(`${rel}: expected exactly 1 H1, found ${h1Count}`);
  if (titleCount !== 1) failures.push(`${rel}: expected exactly 1 title, found ${titleCount}`);
  if (descriptionCount !== 1) failures.push(`${rel}: expected exactly 1 meta description, found ${descriptionCount}`);

  for (const match of html.matchAll(/href=["']([^"'#]+)(?:#[^"']*)?["']/gi)) {
    const href = match[1];
    if (!href.startsWith("/") || href === "/") continue;
    const url = new URL(href, "https://relocation-cost-psi.vercel.app");
    if (url.origin !== "https://relocation-cost-psi.vercel.app") continue;
    if (path.posix.extname(url.pathname)) continue;
    if (!url.pathname.endsWith("/")) failures.push(`${rel}: internal href lacks trailing slash: ${href}`);
    if (!internalTargets.has(url.pathname)) internalTargets.set(url.pathname, rel);
  }

  for (const block of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(block[1]);
    } catch {
      failures.push(`${rel}: invalid JSON-LD block`);
    }
  }

  for (const link of html.matchAll(/<a\b[^>]*data-program=[^>]*>/gi)) {
    if (!/rel=["'][^"']*sponsored/i.test(link[0])) failures.push(`${rel}: affiliate link without rel="sponsored"`);
    if (/awin1\.com/i.test(link[0]) && !/clickref=/i.test(link[0])) failures.push(`${rel}: Awin link without clickref`);
  }

  const canonical = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1];
  if (!canonical) failures.push(`${rel}: canonical missing`);
  else canonicalByPage.set(rel, canonical);
}

for (const [target, source] of internalTargets) {
  const exists = fs.existsSync(path.join(dist, target, "index.html")) || fs.existsSync(path.join(dist, target.replace(/\/$/, "") + ".html"));
  if (!exists) failures.push(`${source}: internal link points to a page that was not built: ${target}`);
}

for (const guide of guidePaths) {
  const file = path.join(dist, guide, "index.html");
  if (!fs.existsSync(file)) continue;
  const html = read(file);
  if (!/"@type":"Article"/.test(html)) failures.push(`${guide}: Article JSON-LD missing`);
  if (!/"@type":"BreadcrumbList"/.test(html)) failures.push(`${guide}: BreadcrumbList JSON-LD missing`);
  if (!html.includes('href="/calculator/"')) failures.push(`${guide}: no link to the calculator`);
  if (!html.includes('href="/moving-cost/"')) failures.push(`${guide}: no link to the route hub`);
}

const sitemapIndex = path.join(dist, "sitemap-index.xml");
const sitemap0 = path.join(dist, "sitemap-0.xml");
if (!fs.existsSync(sitemapIndex)) failures.push("sitemap-index.xml missing");
if (!fs.existsSync(sitemap0)) failures.push("sitemap-0.xml missing");

const sitemapUrls = new Set();
if (fs.existsSync(sitemapIndex)) {
  const indexXml = read(sitemapIndex);
  const refs = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  for (const ref of refs) {
    const file = path.join(dist, new URL(ref).pathname.replace(/^\//, ""));
    if (!fs.existsSync(file)) {
      failures.push(`sitemap child missing: ${new URL(ref).pathname}`);
      continue;
    }
    for (const m of read(file).matchAll(/<loc>([^<]+)<\/loc>/g)) sitemapUrls.add(m[1]);
  }
}

for (const [rel, canonical] of canonicalByPage) {
  if (!sitemapUrls.has(canonical) && !rel.endsWith("404.html")) {
    failures.push(`${rel}: canonical not present in sitemap: ${canonical}`);
  }
}

const routeUrls = [...sitemapUrls].filter(url => {
  const p = new URL(url).pathname;
  return p.startsWith("/moving-cost/") && p !== "/moving-cost/" && !p.startsWith("/moving-cost/cities/");
});
if (routeUrls.length !== 50) failures.push(`expected 50 route URLs, found ${routeUrls.length}`);

const cityRouteCount = JSON.parse(fs.readFileSync(path.resolve("data/city-routes.json"), "utf8")).routes.length;
const cityUrls = [...sitemapUrls].filter(url => {
  const p = new URL(url).pathname;
  return p.startsWith("/moving-cost/cities/") && p !== "/moving-cost/cities/";
});
if (cityUrls.length !== cityRouteCount) failures.push(`expected ${cityRouteCount} city route URLs, found ${cityUrls.length}`);

for (const expected of expectedStatic) {
  const absolute = new URL(expected, "https://relocation-cost-psi.vercel.app").href;
  if (!sitemapUrls.has(absolute)) failures.push(`static sitemap URL missing: ${absolute}`);
}

const report = {
  htmlPages: pages.length,
  sitemapUrls: sitemapUrls.size,
  routePages: routeUrls.length,
  cityRoutePages: cityUrls.length,
  staticPagesChecked: expectedStatic.size,
  failures
};
console.log(JSON.stringify(report, null, 2));

if (failures.length) process.exit(1);
