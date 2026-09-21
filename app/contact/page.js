import Link from "next/link";
import Navigation from "../components/Navigation";

export default function ContactPage() {
  return (
    <main className="page-shell">
      <Navigation />

      <section className="route-card">
        <p className="eyebrow">Visit us</p>
        <h1>Contact & reservations</h1>
        <p>123 Meskel Square, Addis Ababa</p>
        <p>hello@addiseats.com</p>
        <p>+251 11 234 5678</p>

        <Link href="/checkout" className="primary-button">
          Reserve a table
        </Link>
      </section>
    </main>
  );
}
