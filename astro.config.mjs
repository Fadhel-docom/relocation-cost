import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://relocation-cost.pages.dev",
  integrations: [tailwind()],
  output: "static"
});
