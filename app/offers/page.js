import Link from "next/link";
import Navigation from "../components/Navigation";

export default function OffersPage() {
  return (
    <main className="page-shell">
      <Navigation />

      <section className="route-card">
        <p className="eyebrow">This week only</p>
        <h1>Chef offers</h1>
        <p>
          Enjoy a family platter and a house-made Ethiopian coffee flight with this
          week&apos;s special offer.
        </p>
        <Link href="/menu" className="primary-button">
          See the menu
        </Link>
      </section>
    </main>
  );
}
