import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { CONTACT_EMAIL } from "./src/lib/site.js";

export default defineConfig({
  site: "https://relocation-cost-psi.vercel.app",
  integrations: [
    tailwind(),
    sitemap({
      // Keep the contact page out of the sitemap while it is noindex (no email set yet).
      filter: page => Boolean(CONTACT_EMAIL) || !page.endsWith("/contact/")
    })
  ],
  trailingSlash: "always",
  output: "static"
});
