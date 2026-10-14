import "server-only";

import { randomUUID } from "node:crypto";

const storeKey = "__addisEatsOrders";
const orderStore = globalThis[storeKey] ?? (globalThis[storeKey] = new Map());

export function createOrder(orderData, ownerId = null) {
  const order = {
    id: randomUUID(),
    ...orderData,
    ownerId,
    status: "received",
    createdAt: new Date().toISOString(),
  };
  orderStore.set(order.id, order);
  return order;
}

export function findOrder(id) {
  return orderStore.get(id);
}

export function listOrdersForOwner(ownerId) {
  return [...orderStore.values()].filter((order) => order.ownerId === ownerId);
}

export function listAllOrders() {
  return [...orderStore.values()];
}

export function findOrderForOwner(id, ownerId) {
  const order = orderStore.get(id);
  return order?.ownerId === ownerId ? order : null;
}

export function deleteOrder(id) {
  return orderStore.delete(id);
}

export function updateOrder(id, updates) {
  const order = orderStore.get(id);
  if (!order) return null;

  const updatedOrder = { ...order, ...updates };
  orderStore.set(id, updatedOrder);
  return updatedOrder;
}