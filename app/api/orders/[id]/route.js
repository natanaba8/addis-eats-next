import { apiError } from "../../../menu/lib/api-response";
import { findOrderForOwner, findOrder, updateOrder } from "../../../menu/lib/orders";
import { getSession, getSessionUserId } from "../../../menu/lib/session";

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

export async function PATCH(request, { params }) {
  const session = await getSession();
  if (!session) return apiError(401, "UNAUTHORIZED", "Sign in to update orders.");
  if (session.role !== "staff") {
    return apiError(403, "FORBIDDEN", "Staff access is required to update orders.");
  }

  const { id } = await params;
  const order = findOrder(id);
  if (!order) return apiError(404, "ORDER_NOT_FOUND", "Order not found.");

  let input;
  try {
    input = await request.json();
  } catch {
    return apiError(422, "VALIDATION_ERROR", "Provide a valid status update.");
  }
  if (input?.status !== "delivered") {
    return apiError(422, "VALIDATION_ERROR", "Only delivery can be marked from the kitchen.");
  }

  const updatedOrder = updateOrder(order.id, { status: "delivered" });
  return Response.json({ order: updatedOrder });
}