import Link from "next/link";
import { dishes } from "../lib/dishes";

export const menuItems = dishes;

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
