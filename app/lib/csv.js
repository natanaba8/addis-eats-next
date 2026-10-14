import { etb, relative, when } from "../../lib/format.js";

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function ordersToCsv(orders) {
  const columns = [
    ["Order ID", (order) => order.id],
    ["Customer", (order) => order.customerName],
    ["Delivery address", (order) => order.deliveryAddress],
    ["Dish", (order) => order.dishId],
    ["Quantity", (order) => order.quantity],
    ["Price (ETB)", (order) => etb(order.price)],
    ["Status", (order) => order.status],
    ["Placed at", (order) => `${when(order.createdAt)} (${relative(order.createdAt)})`],
  ];
  const header = columns.map(([label]) => csvCell(label)).join(",");
  const rows = orders.map((order) =>
    columns.map(([, valueFor]) => csvCell(valueFor(order))).join(","),
  );

  return [header, ...rows].join("\r\n") + "\r\n";
}
