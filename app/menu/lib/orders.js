import "server-only";

import { randomUUID } from "node:crypto";

const storeKey = "__addisEatsOrders";
const orderStore = globalThis[storeKey] ?? (globalThis[storeKey] = new Map());

export function createOrder(orderData, ownerId = null) {
  const order = {
    id: randomUUID(),
    ...orderData,
    ownerId,
    createdAt: new Date().toISOString(),
  };
  orderStore.set(order.id, order);
  return order;
}

export function findOrder(id) {
  return orderStore.get(id);
}

export function deleteOrder(id) {
  return orderStore.delete(id);
}