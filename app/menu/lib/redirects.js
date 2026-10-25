export function sanitizeNextPath(value) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f]/.test(value)
  ) {
    return "/";
  }

  try {
    const destination = new URL(value, "https://addis-eats-next-sigma.vercel.app");
    if (destination.origin !== "https://addis-eats-next-sigma.vercel.app") return "/";
    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return "/";
  }
}