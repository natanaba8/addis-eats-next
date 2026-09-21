export default function MenuLoading() {
  return (
    <main className="page-shell">
      <div className="status-card" role="status" aria-live="polite">
        <p className="eyebrow">Loading</p>
        <h2>Preparing the menu...</h2>
      </div>
    </main>
  );
}
