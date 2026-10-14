import assert from "node:assert/strict";
import test from "node:test";
import { ordersToCsv } from "../app/lib/csv.js";

test("CSV keeps commas, quotes, and newlines inside their cells", () => {
  const csv = ordersToCsv([
    {
      id: "order-comma",
      customerName: "Comma, Customer",
      deliveryAddress: "Bole, Addis Ababa",
      dishId: "doro,wat",
      quantity: 1,
      price: 430,
      status: "received",
      createdAt: "2026-10-14T12:00:00.000Z",
    },
    {
      id: "order-quote",
      customerName: 'Quote "Customer"',
      deliveryAddress: 'House "3", Bole',
      dishId: "kitfo",
      quantity: 2,
      price: 460,
      status: "delivered",
      createdAt: "2026-10-14T12:01:00.000Z",
    },
    {
      id: "order-newline",
      customerName: "Line one\nLine two",
      deliveryAddress: 'Ground floor, "Building 2"\nRear entrance',
      dishId: "tibs",
      quantity: 1,
      price: 440,
      status: "received",
      createdAt: "2026-10-14T12:02:00.000Z",
    },
  ]);

  assert.match(csv, /"Comma, Customer","Bole, Addis Ababa","doro,wat"/);
  assert.match(csv, /"Quote ""Customer""","House ""3"", Bole","kitfo"/);
  assert.match(csv, /"Line one\nLine two","Ground floor, ""Building 2""\nRear entrance","tibs"/);
  assert.ok(csv.endsWith("\r\n"));
});