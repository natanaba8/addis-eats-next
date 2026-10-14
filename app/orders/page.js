import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../menu/lib/session";
import { listOrdersForOwner } from "../menu/lib/orders";

export const metadata = {
  title: "Your orders",
  description:
    "Review your recent Addis Eats orders and follow each meal's preparation status.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in?next=%2Forders");

  const orders = listOrdersForOwner(session.id);

  return (
    <main className="page-shell">
      <section className="route-card">
        <p className="eyebrow">Your account</p>
        <h1>Your orders</h1>
        {orders.length ? (
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                <Link href={`/orders/${order.id}`} className="text-link">
                  {order.dishId} · {order.status}
                </Link>
                <span> Placed {new Date(order.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : <p>No orders yet.</p>}
      </section>
    </main>
  );
}