import test from "node:test";
import assert from "node:assert/strict";
import {
  getDashboardState,
  sortAndPageOrders,
  summarizeOrders,
} from "../app/orders/dashboard-data.js";

const today = new Date("2026-10-19T15:00:00.000Z");

test("dashboard state distinguishes loading, error, empty, and populated", () => {
  assert.equal(getDashboardState({ isLoading: true, error: new Error(), orders: [] }), "loading");
  assert.equal(getDashboardState({ error: new Error(), orders: [] }), "error");
  assert.equal(getDashboardState({ orders: [] }), "empty");
  assert.equal(getDashboardState({ orders: [{ id: "order-1" }] }), "populated");
});

test("summary returns seven UTC days and excludes cancelled revenue", () => {
  const summary = summarizeOrders([
    { createdAt: "2026-10-19T03:00:00.000Z", total: 250, status: "received" },
    { createdAt: "2026-10-19T12:00:00.000Z", total: 100, status: "cancelled" },
    { createdAt: "2026-10-10T12:00:00.000Z", total: 75, status: "delivered" },
  ], today);

  assert.equal(summary.days.length, 7);
  assert.equal(summary.days.at(-1).date, "2026-10-19");
  assert.equal(summary.days.at(-1).orderCount, 2);
  assert.equal(summary.days.at(-1).revenue, 250);
  assert.equal(summary.orderCount, 3);
  assert.equal(summary.revenue, 325);
});

test("sorting and paging are sanitized and do not mutate source orders", () => {
  const orders = Array.from({ length: 23 }, (_, index) => ({
    id: `order-${index}`,
    total: index * 10,
    createdAt: new Date(Date.UTC(2026, 0, index + 1)).toISOString(),
    status: "received",
    dishId: "tibs",
  }));
  const result = sortAndPageOrders(orders, { sort: "total", direction: "asc", page: "2" });

  assert.equal(result.page, 2);
  assert.equal(result.totalPages, 3);
  assert.equal(result.orders.length, 10);
  assert.equal(result.orders[0].total, 100);
  assert.equal(orders[0].total, 0);
  assert.equal(sortAndPageOrders(orders, { sort: "bad", page: "999" }).page, 3);
});