import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "../../components/Navigation";
import { menuItems } from "../components/MenuList";

export default async function MenuItemPage({ params }) {
  const resolvedParams = await params;
  const item = menuItems.find((entry) => entry.slug === resolvedParams.id);

  if (!item) {
    notFound();
  }

  return (
    <main className="page-shell">
      <Navigation />

      <section className="detail-card">
        <p className="eyebrow">Dish details</p>
        <h1>{item.name}</h1>
        <p>{item.description}</p>
        <p>
          <strong>Price:</strong> ETB {item.price}
        </p>

        <div className="cta-row">
          <Link href="/menu" className="primary-button">
            Back to menu
          </Link>
          <Link href="/checkout" className="secondary-button">
            Order now
          </Link>
        </div>
      </section>
    </main>
  );
}
