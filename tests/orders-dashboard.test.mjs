import test from "node:test";
import assert from "node:assert/strict";
import {
  DASHBOARD_PREVIEW_STATES,
  getDashboardState,
  getPreviewOrders,
  sortAndPageOrders,
  summarizeOrders,
} from "../app/orders/dashboard-data.js";
import { normalizeNeighborhood } from "../app/menu/lib/neighborhood.js";

const today = new Date("2026-10-19T15:00:00.000Z");

test("dashboard state distinguishes loading, error, empty, and populated", () => {
  assert.equal(getDashboardState({ isLoading: true, error: new Error(), orders: [] }), "loading");
  assert.equal(getDashboardState({ error: new Error(), orders: [] }), "error");
  assert.equal(getDashboardState({ orders: [] }), "empty");
  assert.equal(getDashboardState({ orders: [{ id: "order-1" }] }), "populated");
  assert.deepEqual(DASHBOARD_PREVIEW_STATES, ["loading", "empty", "error", "populated"]);
});

test("populated preview data has neighbourhoods and dates inside the chart range", () => {
  const orders = getPreviewOrders(today);
  const summary = summarizeOrders(orders, today);

  assert.equal(orders.length, 18);
  assert.ok(summary.neighborhoods.length > 1);
  assert.ok(summary.days.some((day) => day.orderCount > 0));
});

test("summary returns seven UTC days and excludes cancelled revenue", () => {
  const summary = summarizeOrders([
    { createdAt: "2026-10-19T03:00:00.000Z", total: 250, status: "received", neighborhood: "Bole" },
    { createdAt: "2026-10-19T12:00:00.000Z", total: 100, status: "cancelled", neighborhood: "Bole" },
    { createdAt: "2026-10-10T12:00:00.000Z", total: 75, status: "delivered", neighborhood: "bole" },
  ], today);

  assert.equal(summary.days.length, 7);
  assert.equal(summary.days.at(-1).date, "2026-10-19");
  assert.equal(summary.days.at(-1).orderCount, 2);
  assert.equal(summary.days.at(-1).revenue, 250);
  assert.equal(summary.orderCount, 3);
  assert.equal(summary.revenue, 325);
  assert.deepEqual(summary.neighborhoods, [{ neighborhood: "Bole", revenue: 325 }]);
});

test("neighborhood normalization prefers explicit values and falls back to legacy addresses", () => {
  assert.equal(normalizeNeighborhood("  Old   Airport ", "Bole Road, Addis Ababa"), "Old Airport");
  assert.equal(normalizeNeighborhood(undefined, "123 Main St, Bole, Addis Ababa"), "Bole");
  assert.equal(normalizeNeighborhood(undefined, "123 Main St, Bole"), "Bole");
  assert.equal(normalizeNeighborhood(undefined, "123 Main St"), "Unspecified");
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