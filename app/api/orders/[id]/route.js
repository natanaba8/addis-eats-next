import { apiError } from "../../../menu/lib/api-response";
import { findOrder } from "../../../menu/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id } = await params;
  const order = findOrder(id);

  if (!order) {
    return apiError(404, "ORDER_NOT_FOUND", "Order not found.");
  }

  return Response.json({
    order: {
      id: order.id,
      status: order.status,
      createdAt: order.createdAt,
    },
  });
}