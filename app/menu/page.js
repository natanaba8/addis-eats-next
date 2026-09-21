import Link from "next/link";
import Navigation from "../components/Navigation";
import { MenuList, menuItems } from "./components/MenuList";

export default async function MenuPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const triggerError = resolvedSearchParams?.error === "1";

  if (triggerError) {
    throw new Error("This demo error was deliberately triggered from the menu page.");
  }

  await new Promise((resolve) => setTimeout(resolve, 250));

  return (
    <main className="page-shell">
      <Navigation />

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
        <MenuList items={menuItems} />
      </section>
    </main>
  );
}
