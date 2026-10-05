export const dishes = [
  {
    name: "Doro Wat",
    slug: "doro-wat",
    description: "A rich chicken stew with onions, garlic, and berbere spice.",
    price: 430,
  },
  {
    name: "Kitfo",
    slug: "kitfo",
    description: "Minced beef with mitmita, clarified butter, and fresh herbs.",
    price: 460,
  },
  {
    name: "Tibs",
    slug: "tibs",
    description: "Sautéed beef cubes with peppers, onions, and clove seasoning.",
    price: 440,
  },
  {
    name: "Misir Wat",
    slug: "misir-wat",
    description: "Slow-cooked lentils with ginger, garlic, and a bold spice blend.",
    price: 320,
  },
];

export function findDish(id) {
  return dishes.find((dish) => dish.slug === id);
}