"use client";

import Link from "next/link";

export default function MenuError({ error, reset }) {
  return (
    <main className="page-shell">
      <div className="status-card">
        <p className="eyebrow">Error</p>
        <h2>Something went wrong in the menu.</h2>
        <p>{error?.message || "An unexpected issue occurred while loading the menu."}</p>

        <button type="button" onClick={() => reset()}>
          Try again
        </button>

        <div style={{ marginTop: 18 }}>
          <Link href="/menu" className="text-link">
            Return to menu
          </Link>
        </div>
      </div>
    </main>
  );
}
