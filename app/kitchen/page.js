import { notFound, redirect } from "next/navigation";
import { getSession } from "../menu/lib/session";
import { listAllOrders } from "../menu/lib/orders";
import { findDish } from "../menu/lib/dishes";
import KitchenOrders from "./KitchenOrders";

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

  const orders = listAllOrders().map((order) => ({
    id: order.id,
    customerName: order.customerName,
    dishId: order.dishId,
    quantity: order.quantity,
    price: findDish(order.dishId)?.price ?? 0,
    status: order.status,
    createdAt: order.createdAt,
  }));

  return (
    <main className="page-shell">
      <section className="route-card">
        <p className="eyebrow">Staff workspace</p>
        <h1>Kitchen orders</h1>
        <KitchenOrders initialOrders={orders} />
      </section>
    </main>
  );
}