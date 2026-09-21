import Link from "next/link";
import Navigation from "../components/Navigation";

export default function CheckoutPage() {
  return (
    <main className="page-shell">
      <Navigation />

      <section className="route-card">
        <p className="eyebrow">Ready to order</p>
        <h1>Checkout</h1>
        <p>
          Your next meal is almost ready. Review your selection, confirm your order, and
          keep the flavors of Addis flowing.
        </p>
        <Link href="/menu" className="secondary-button">
          Back to menu
        </Link>
      </section>
    </main>
  );
}
