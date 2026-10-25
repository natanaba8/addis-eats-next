export function slugify(name) {
  return name
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateDish(input, existingSlugs = []) {
  const fieldErrors = {};

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {
      success: false,
      fieldErrors: { form: ["Provide dish details as an object."] },
    };
  }

  const name = typeof input.name === "string" ? input.name.trim().replace(/\s+/g, " ") : "";
  const description =
    typeof input.description === "string" ? input.description.trim() : "";
  const price = Number(input.price);
  const slug = slugify(name);

  if (name.length < 2 || name.length > 60) {
    fieldErrors.name = ["Name must be between 2 and 60 characters."];
  } else if (!slug) {
    fieldErrors.name = ["Name must include at least one letter or number."];
  } else if (existingSlugs.includes(slug)) {
    fieldErrors.name = ["A dish with this name already exists."];
  }
  if (description.length < 10 || description.length > 200) {
    fieldErrors.description = ["Description must be between 10 and 200 characters."];
  }
  if (!Number.isInteger(price) || price < 1 || price > 10000) {
    fieldErrors.price = ["Price must be a whole number of birr from 1 to 10,000."];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  return { success: true, data: { name, slug, description, price } };
}
