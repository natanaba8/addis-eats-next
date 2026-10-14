import { dishes } from "./menu/lib/dishes";
import { siteUrlForPath } from "./lib/site";

export default function sitemap() {
  const publicPaths = ["/", "/about", "/contact", "/offers", "/menu"];

  return [
    ...publicPaths.map((path) => ({
      url: siteUrlForPath(path),
    })),
    ...dishes.map((dish) => ({
      url: siteUrlForPath(`/menu/${dish.slug}`),
    })),
  ];
}