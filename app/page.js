import Link from "next/link";
import Image from "next/image";

const featuredDishes = [
  { name: "Doro Wat", slug: "doro-wat" },
  { name: "Kitfo", slug: "kitfo" },
  { name: "Tibs", slug: "tibs" },
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Authentic flavors, freshly served</p>
          <h1>Welcome to Addis Eats</h1>
          <p className="lead">
            Discover our seasonal dishes, classic Ethiopian favorites, and a warm dining
            experience rooted in tradition.
          </p>
          <p className="lead">የኢትዮጵያን ወቅታዊ የሆኑ ባህላዊ ምግቦችን ጣዕማቸውን ይሞክሩ ያጣጥሙ።</p>
          <div className="cta-row">
            <Link href="/menu" className="primary-button">
              Explore menu
            </Link>
            <Link href="/contact" className="secondary-button">
              Book a table
            </Link>
          </div>
        </div>
        <Image
          className="hero-image"
          src="/ethiopian-platter.webp"
          width={1000}
          height={700}
          sizes="(max-width: 800px) 100vw, 46vw"
          alt="Ethiopian injera platter served with doro wat, lentils, greens, and vegetables"
          priority
        />
      </section>

      <section className="featured">
        <h2>Featured specials</h2>
        <div className="card-grid">
          {featuredDishes.map((dish) => (
            <article key={dish.slug} className="info-card">
              <h3>{dish.name}</h3>
              <p>Prepared with vibrant spices and fresh ingredients.</p>
              <Link href={`/menu/${dish.slug}`} className="text-link">
                View details
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
