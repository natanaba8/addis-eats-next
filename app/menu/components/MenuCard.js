import Link from "next/link";

export default function MenuCard({ item }) {
  return (
    <article className="info-card">
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <Link href={`/menu/${item.slug}`} className="text-link">
        View details
      </Link>
    </article>
  );
}
