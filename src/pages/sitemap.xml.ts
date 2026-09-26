import type { APIRoute } from "astro";

const pages = [
  "/",
  "/calculator",
  "/guides/moving-cost",
  "/guides/relocation-budget",
  "/guides/diy-vs-movers"
];

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://relocation-cost.pages.dev");
  const body = pages.map(path => `  <url><loc>${new URL(path, base).href}</loc></url>`).join("\n");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
};
