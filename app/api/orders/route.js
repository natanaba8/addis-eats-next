import { apiError } from "../../menu/lib/api-response";
import { createOrder, listOrdersForOwner } from "../../menu/lib/orders";
import { validateOrder } from "../../menu/lib/order-schema";
import { getSessionUserId } from "../../menu/lib/session";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return apiError(401, "UNAUTHORIZED", "Sign in to view your orders.");

  return Response.json({ orders: listOrdersForOwner(userId) });
}

export async function POST(request) {
  const userId = await getSessionUserId();
  if (!userId) return apiError(401, "UNAUTHORIZED", "Sign in to place an order.");

  let input;
  try {
    input = await request.json();
  } catch {
    return apiError(422, "VALIDATION_ERROR", "Order details are invalid.", {
      form: ["Provide a valid JSON request body."],
    });
  }

  const result = validateOrder(input);
  if (!result.success) {
    return apiError(422, "VALIDATION_ERROR", "Order details are invalid.", result.fieldErrors);
  }

  const order = createOrder(result.data, userId);
  return Response.json({ order }, { status: 201 });
}