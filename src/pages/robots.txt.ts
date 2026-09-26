import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => new Response(
`User-agent: *
Allow: /

Sitemap: ${new URL("sitemap.xml", site ?? "https://relocation-cost.pages.dev").href}
`,
{ headers: { "Content-Type": "text/plain" } }
);
