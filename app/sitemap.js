import { dishes } from "./menu/lib/dishes";
import { siteUrl } from "./lib/site";

export default function sitemap() {
  const publicPaths = ["/", "/about", "/contact", "/offers", "/menu"];

  return [
    ...publicPaths.map((path) => ({
      url: new URL(path, siteUrl).toString(),
    })),
    ...dishes.map((dish) => ({
      url: new URL(`/menu/${dish.slug}`, siteUrl).toString(),
    })),
  ];
}