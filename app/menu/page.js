import Link from "next/link";
import { Suspense } from "react";
import { MenuList, menuItems } from "./components/MenuList";

async function DishList() {
  await new Promise((resolve) => setTimeout(resolve, 450));
  return <MenuList items={menuItems} />;
}

// This menu is mostly static, but a short revalidation window keeps it fresh.
export const revalidate = 60;

export default async function MenuPage() {
  return (
    <main className="page-shell">
      <section className="route-card">
        <p className="eyebrow">Handpicked favorites</p>
        <h1>Menu</h1>
        <p>Explore signature Ethiopian dishes and comforting classics.</p>
        <div className="cta-row">
          <Link href="/offers" className="primary-button">
            View offers
          </Link>
          <Link href="/checkout" className="secondary-button">
            Proceed to checkout
          </Link>
        </div>

        <Suspense fallback={<div className="menu-skeleton">Loading dishes…</div>}>
          <DishList />
        </Suspense>
      </section>
    </main>
  );
}
