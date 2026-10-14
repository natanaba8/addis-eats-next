import { apiError } from "../../../menu/lib/api-response";
import { findOrderForOwner } from "../../../menu/lib/orders";
import { getSessionUserId } from "../../../menu/lib/session";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const userId = await getSessionUserId();
  if (!userId) return apiError(401, "UNAUTHORIZED", "Sign in to view this order.");

  const { id } = await params;
  const order = findOrderForOwner(id, userId);

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