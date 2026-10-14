import { notFound, redirect } from "next/navigation";
import { getSession } from "../menu/lib/session";
import { listAllOrders } from "../menu/lib/orders";

export const metadata = {
  title: "Kitchen orders",
  description:
    "Staff can review incoming Addis Eats orders and see which dishes need preparing.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function KitchenPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in?next=%2Fkitchen");
  if (session.role !== "staff") notFound();

  const orders = listAllOrders();

  return (
    <main className="page-shell">
      <section className="route-card">
        <p className="eyebrow">Staff workspace</p>
        <h1>Kitchen orders</h1>
        {orders.length ? (
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                {order.customerName}: {order.dishId} × {order.quantity} · {order.status}
              </li>
            ))}
          </ul>
        ) : <p>No orders to prepare.</p>}
      </section>
    </main>
  );
}