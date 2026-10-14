import { notFound } from "next/navigation";
import OrderStatus from "./OrderStatus";
import { findOrderForOwner } from "../../menu/lib/orders";
import { getSessionUserId } from "../../menu/lib/session";

export const metadata = {
  title: "Track your order",
  description:
    "Check the latest preparation status and details for your Addis Eats order.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OrderStatusPage({ params }) {
  const userId = await getSessionUserId();
  if (!userId) notFound();

  const { id } = await params;
  const order = findOrderForOwner(id, userId);
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