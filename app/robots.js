import { siteUrl } from "./lib/site";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout", "/orders", "/sign-in", "/kitchen"],
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}