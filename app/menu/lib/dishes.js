import "server-only";

const seedDishes = [
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

// Dishes added by an admin are kept in memory, like orders in `orders.js`.
// They are lost on restart, so a real deployment needs a database.
const storeKey = "__addisEatsDishes";
const dishStore = globalThis[storeKey] ?? (globalThis[storeKey] = [...seedDishes]);

// The seed list is used for `generateStaticParams`, so build output stays the same.
export const dishes = seedDishes;

export function listDishes() {
  return [...dishStore];
}

export function findDish(id) {
  return dishStore.find((dish) => dish.slug === id);
}

export function addDish(dish) {
  dishStore.push(dish);
  return dish;
}
