"use client";

export default function OrdersError({ reset }) {
  return (
    <main className="page-shell">
      <section className="route-card" role="alert">
        <p className="eyebrow">Your account</p>
        <h1>Orders are unavailable</h1>
        <p>We could not load your order dashboard.</p>
        <button className="primary-button" type="button" onClick={reset}>
          Try again
        </button>
      </section>
    </main>
  );
}