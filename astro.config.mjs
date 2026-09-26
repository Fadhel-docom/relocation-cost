import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://relocation-cost-psi.vercel.app",
  integrations: [tailwind(), sitemap()],
  output: "static"
});
