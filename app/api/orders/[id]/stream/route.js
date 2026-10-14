import { apiError } from "../../../../menu/lib/api-response";
import { findOrderForOwner, subscribeToOrder } from "../../../../menu/lib/orders";
import { getSessionUserId } from "../../../../menu/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const userId = await getSessionUserId();
  if (!userId) return apiError(401, "UNAUTHORIZED", "Sign in to view this order.");

  const { id } = await params;
  const order = findOrderForOwner(id, userId);
  if (!order) return apiError(404, "ORDER_NOT_FOUND", "Order not found.");

  const encoder = new TextEncoder();
  let unsubscribe = () => {};
  let heartbeat;
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      const close = () => {
        if (closed) return;
        closed = true;
        clearInterval(heartbeat);
        unsubscribe();
        request.signal.removeEventListener("abort", close);
        controller.close();
      };

      const sendOrder = (nextOrder) => {
        if (closed) return;
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ order: nextOrder })}\n\n`),
        );
        if (["delivered", "cancelled"].includes(nextOrder.status)) close();
      };

      unsubscribe = subscribeToOrder(id, sendOrder);
      request.signal.addEventListener("abort", close, { once: true });
      sendOrder(order);
      if (!closed) {
        heartbeat = setInterval(() => {
          if (!closed) controller.enqueue(encoder.encode(": keep-alive\n\n"));
        }, 20000);
      }
    },
    cancel() {
      closed = true;
      clearInterval(heartbeat);
      unsubscribe();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}