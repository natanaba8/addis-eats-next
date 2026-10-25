const configuredSiteUrl =
  process.env.SITE_URL || "https://addis-eats-next-sigma.vercel.app";
const siteUrl = new URL(configuredSiteUrl);
siteUrl.pathname = `${siteUrl.pathname.replace(/\/+$/, "")}/`;

export { siteUrl };

export function siteUrlForPath(path) {
  return new URL(path.replace(/^\/+/, ""), siteUrl).toString();
}