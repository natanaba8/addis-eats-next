import Link from "next/link";

export const menuItems = [
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

export function MenuList({ items = menuItems }) {
  return (
    <ul className="menu-list">
      {items.map((item) => (
        <li key={item.slug} className="menu-item">
          <div>
            <strong>{item.name}</strong>
            <span>{item.description}</span>
          </div>
          <div>
            <span className="price">ETB {item.price}</span>
            <div style={{ marginTop: 10 }}>
              <Link href={`/menu/${item.slug}`} className="text-link">
                Open item
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
