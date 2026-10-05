import { apiError } from "../../menu/lib/api-response";
import { createOrder } from "../../menu/lib/orders";
import { validateOrder } from "../../menu/lib/order-schema";
import { getSessionUserId } from "../../menu/lib/session";

export async function POST(request) {
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

  const order = createOrder(result.data, await getSessionUserId());
  return Response.json({ order }, { status: 201 });
}