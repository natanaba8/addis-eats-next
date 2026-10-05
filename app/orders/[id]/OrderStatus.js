"use client";

import useSWR from "swr";
import { fetcher } from "../../menu/lib/fetcher";

export default function OrderStatus({ initialOrder }) {
  const { data, error } = useSWR(`/api/orders/${initialOrder.id}`, fetcher, {
    fallbackData: { order: initialOrder },
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });
  const order = data?.order ?? initialOrder;

  return (
    <section className="status-card" aria-live="polite">
      <p className="eyebrow">Order status</p>
      <h1>{order.status === "cancelled" ? "Order cancelled" : "Order received"}</h1>
      <p>Reference: {order.id}</p>
      <p>Status: <strong>{order.status}</strong></p>
      <p>Placed: <time dateTime={order.createdAt}>{order.createdAt}</time></p>
      {error ? <p role="alert">Status refresh failed. Showing the last known status.</p> : null}
    </section>
  );
}