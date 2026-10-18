export default function OrdersLoading() {
  return (
    <main className="page-shell">
      <section className="route-card" role="status" aria-live="polite">
        <p className="eyebrow">Your account</p>
        <h1>Your orders</h1>
        <p>Loading order activity...</p>
      </section>
    </main>
  );
}