"use client";

import { useState } from "react";
import { etb, relative, when } from "../../lib/format.js";
import { ordersToCsv } from "../lib/csv";

export default function KitchenOrders({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  function exportCsv() {
    const blob = new Blob([ordersToCsv(orders)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "addis-eats-orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function markDelivered(orderId) {
    setUpdatingId(orderId);
    setError("");
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "delivered" }),
      });
      if (!response.ok) throw new Error("Could not mark this order delivered.");
      const { order: updatedOrder } = await response.json();
      setOrders((current) => current.map((order) =>
        order.id === orderId ? { ...order, status: updatedOrder.status } : order,
      ));
    } catch (cause) {
      setError(cause.message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <>
      <div className="cta-row">
        <button className="secondary-button" type="button" onClick={exportCsv} disabled={!orders.length}>
          Export orders CSV
        </button>
      </div>
      {error ? <p role="alert">{error}</p> : null}
      {orders.length ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <strong>{order.customerName}</strong>: {order.dishId} × {order.quantity} · {etb(order.price)} · {order.status}
              <span> Deliver to: {order.deliveryAddress || "Address not recorded"}</span>
              <span> Placed <time dateTime={order.createdAt}>{when(order.createdAt)}</time> ({relative(order.createdAt)})</span>
              {order.status !== "delivered" && order.status !== "cancelled" ? (
                <button
                  className="secondary-button"
                  type="button"
                  disabled={updatingId === order.id}
                  onClick={() => markDelivered(order.id)}
                >
                  {updatingId === order.id ? "Updating..." : "Mark delivered"}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : <p>No orders to prepare.</p>}
    </>
  );
}