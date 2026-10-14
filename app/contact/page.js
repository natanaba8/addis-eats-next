import Link from "next/link";

export const metadata = {
  title: "Contact and reservations",
  description:
    "Get in touch with Addis Eats in Addis Ababa to ask a question or plan your next visit.",
};

export default function ContactPage() {
  return (
    <main className="page-shell">
      <section className="route-card">
        <p className="eyebrow">Visit us</p>
        <h1>Contact & reservations</h1>
        <p>Addis Ababa</p>
        <p>natan@gmail.com</p>
        <p>+251 11 234 5678</p>
        <Link href="/checkout" className="primary-button">
          Reserve a table
        </Link>
      </section>
    </main>
  );
}
