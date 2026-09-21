import Link from "next/link";
import Navigation from "../components/Navigation";

export default function AboutPage() {
  return (
    <main className="page-shell">
      <Navigation />

      <section className="route-card">
        <p className="eyebrow">A family story</p>
        <h1>About Addis Eats</h1>
        <p>
          Addis Eats celebrates Ethiopian hospitality with a menu inspired by generations
          of home-cooked recipes, warm gatherings, and carefully sourced ingredients.
        </p>
        <p>
          We bring together slow-simmered stews, fresh injera, and vibrant spices in a
          dining experience made for sharing.
        </p>
        <Link href="/menu" className="primary-button">
          Preview our dishes
        </Link>
      </section>
    </main>
  );
}
