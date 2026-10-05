import Link from "next/link";
import MenuBrowser from "./components/MenuBrowser";
import { getDishesPage } from "./lib/menu-data";

// This menu is mostly static, but a short revalidation window keeps it fresh.
export const revalidate = 60;

export default async function MenuPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const page = Number.parseInt(params.page ?? "1", 10);
  const initialData = getDishesPage({ query, page });

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

        <MenuBrowser
          key={`${initialData.query}:${initialData.page}`}
          initialData={initialData}
        />
      </section>
    </main>
  );
}
