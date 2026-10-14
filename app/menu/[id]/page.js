import Link from "next/link";
import { notFound } from "next/navigation";
import { findDish, dishes } from "../lib/dishes";

export function generateStaticParams() {
  return dishes.map((dish) => ({ id: dish.slug }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = findDish(id);
  if (!dish) return {};

  const description = `${dish.description} Enjoy it at Addis Eats for ETB ${dish.price}.`;
  return {
    title: dish.name,
    description,
    openGraph: {
      title: dish.name,
      description,
      type: "article",
    },
  };
}

export default async function MenuItemPage({ params }) {
  const { id } = await params;
  const item = findDish(id);

  if (!item) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: item.name,
    description: item.description,
    offers: {
      "@type": "Offer",
      price: item.price,
      priceCurrency: "ETB",
    },
  };

  return (
    <main className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
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
