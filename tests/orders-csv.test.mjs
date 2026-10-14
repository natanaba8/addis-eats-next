import assert from "node:assert/strict";
import test from "node:test";
import { ordersToCsv } from "../app/lib/csv.js";

test("CSV keeps commas, quotes, and newlines inside their cells", () => {
  const csv = ordersToCsv([
    {
      id: "order-comma",
      customerName: "Comma, Customer",
      dishId: "doro,wat",
      quantity: 1,
      price: 430,
      status: "received",
      createdAt: "2026-10-14T12:00:00.000Z",
    },
    {
      id: "order-quote",
      customerName: 'Quote "Customer"',
      dishId: "kitfo",
      quantity: 2,
      price: 460,
      status: "delivered",
      createdAt: "2026-10-14T12:01:00.000Z",
    },
    {
      id: "order-newline",
      customerName: "Line one\nLine two",
      dishId: "tibs",
      quantity: 1,
      price: 440,
      status: "received",
      createdAt: "2026-10-14T12:02:00.000Z",
    },
  ]);

  assert.match(csv, /"order-comma","Comma, Customer","doro,wat"/);
  assert.match(csv, /"order-quote","Quote ""Customer""","kitfo"/);
  assert.match(csv, /"order-newline","Line one\nLine two","tibs"/);
  assert.ok(csv.endsWith("\r\n"));
});