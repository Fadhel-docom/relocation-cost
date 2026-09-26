import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://relocation-cost-psi.vercel.app",
  integrations: [tailwind()],
  output: "static"
});
