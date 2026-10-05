import { notFound } from "next/navigation";
import OrderStatus from "./OrderStatus";
import { findOrder } from "../../menu/lib/orders";

export const dynamic = "force-dynamic";

export default async function OrderStatusPage({ params }) {
  const { id } = await params;
  const order = findOrder(id);
  if (!order) notFound();

  const initialOrder = {
    id: order.id,
    status: order.status,
    createdAt: order.createdAt,
  };

  return (
    <main className="page-shell">
      <OrderStatus initialOrder={initialOrder} />
    </main>
  );
}