"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { relative, when } from "../../lib/format";

const OrderMap = dynamic(() => import("./OrderMap"), {
  ssr: false,
  loading: () => (
    <div className="order-map-placeholder" role="status">
      Loading delivery map...
    </div>
  ),
});

export default function OrderStatus({ initialOrder }) {
  const [order, setOrder] = useState(initialOrder);
  const [connection, setConnection] = useState(
    ["delivered", "cancelled"].includes(initialOrder.status) ? "closed" : "connecting",
  );

  useEffect(() => {
    if (["delivered", "cancelled"].includes(initialOrder.status)) return undefined;

    const stream = new EventSource(`/api/orders/${initialOrder.id}/stream`);
    stream.onopen = () => setConnection("connected");
    stream.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
        setOrder(update.order);
        if (["delivered", "cancelled"].includes(update.order.status)) {
          stream.close();
          setConnection("closed");
        }
      } catch {
        setConnection("error");
      }
    };
    stream.onerror = () => {
      if (stream.readyState === EventSource.CLOSED) setConnection("closed");
      else setConnection("reconnecting");
    };

    return () => stream.close();
  }, [initialOrder.id, initialOrder.status]);

  const isDelivered = order.status === "delivered";

  return (
    <section className="status-card" aria-live="polite">
      <p className="eyebrow">Order status</p>
      <h1>{isDelivered ? "Order delivered" : order.status === "cancelled" ? "Order cancelled" : "Order received"}</h1>
      <p>Reference: {order.id}</p>
      <p>Status: <strong>{order.status}</strong></p>
      <p>
        Placed: <time dateTime={order.createdAt}>{when(order.createdAt)}</time> ({relative(order.createdAt)})
      </p>
      <p className={`connection-indicator connection-${connection}`} role="status">
        <span aria-hidden="true" />
        {isDelivered ? "Delivered · live updates closed" : `Live updates ${connection}`}
      </p>
      <h2>Courier route</h2>
      <p>
        Illustrative route in Addis Ababa: the courier is near Bole, heading to the marked delivery point.
        This map is a demo route, not live GPS tracking.
      </p>
      <OrderMap />
    </section>
  );
}