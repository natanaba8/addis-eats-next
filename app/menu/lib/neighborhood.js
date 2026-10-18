export function normalizeNeighborhood(value, deliveryAddress = "") {
  const explicit = typeof value === "string" ? value.trim() : "";
  const addressParts = typeof deliveryAddress === "string"
    ? deliveryAddress.split(",").map((part) => part.trim()).filter(Boolean)
    : [];
  let fallback = "";

  if (addressParts.length >= 3) {
    fallback = addressParts.at(-2);
  } else if (addressParts.length === 2) {
    fallback = addressParts[1].toLocaleLowerCase("en") === "addis ababa"
      ? addressParts[0]
      : addressParts[1];
  }

  return (explicit || fallback || "Unspecified").replace(/\s+/g, " ");
}