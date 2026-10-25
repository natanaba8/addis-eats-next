import test from "node:test";
import assert from "node:assert/strict";
import { slugify, validateDish } from "../app/menu/lib/dish-schema.js";

test("slugify builds URL-safe slugs from dish names", () => {
  assert.equal(slugify("Shiro Wat"), "shiro-wat");
  assert.equal(slugify("  Tibs — Spicy!  "), "tibs-spicy");
  assert.equal(slugify("Sautéed Gomen"), "sauteed-gomen");
});

test("validateDish accepts a valid dish and trims its fields", () => {
  const result = validateDish({
    name: "  Shiro   Wat ",
    description: " Smooth chickpea stew with garlic. ",
    price: "300",
  });
  assert.deepEqual(result, {
    success: true,
    data: {
      name: "Shiro Wat",
      slug: "shiro-wat",
      description: "Smooth chickpea stew with garlic.",
      price: 300,
    },
  });
});

test("validateDish rejects bad fields and duplicate names", () => {
  const result = validateDish(
    { name: "Doro Wat", description: "short", price: "12.5" },
    ["doro-wat"],
  );
  assert.equal(result.success, false);
  assert.deepEqual(Object.keys(result.fieldErrors).sort(), ["description", "name", "price"]);

  assert.equal(validateDish({ name: "!!", description: "Long enough text", price: 5 }).success, false);
  assert.equal(validateDish(null).success, false);
});
