import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="page-shell">
      <section className="status-card">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The route you requested does not exist or is no longer available.</p>
        <Link href="/" className="primary-button">
          Return home
        </Link>
      </section>
    </main>
  );
}
