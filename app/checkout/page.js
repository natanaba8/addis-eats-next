import Link from "next/link";
import { cookies } from "next/headers";

// `cookies()` is read here, so this page must stay force-dynamic.
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const cartValue = cookieStore.get("cart")?.value ?? "empty";

  return (
    <main className="page-shell">
      <section className="route-card">
        <p className="eyebrow">Ready to order</p>
        <h1>Checkout</h1>
        <p>
          Your next meal is almost ready. Review your selection, confirm your order, and
          keep the flavors of Addis flowing.
        </p>
        <div className="status-chip">Cart status: {cartValue}</div>
        <Link href="/menu" className="secondary-button">
          Back to menu
        </Link>
      </section>
    </main>
  );
}
