const DAY_COUNT = 7;
export const ORDERS_PAGE_SIZE = 10;
export const ORDER_SORT_FIELDS = ["createdAt", "dishId", "neighborhood", "status", "total"];
export const DASHBOARD_PREVIEW_STATES = ["loading", "empty", "error", "populated"];

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function neighborhoodLabel(value) {
  return typeof value === "string" && value.trim() ? value.trim().replace(/\s+/g, " ") : "Unspecified";
}

export function getDashboardState({ isLoading = false, error = null, orders = [] }) {
  if (isLoading) return "loading";
  if (error) return "error";
  return orders.length ? "populated" : "empty";
}

export function summarizeOrders(orders, now = new Date()) {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const days = Array.from({ length: DAY_COUNT }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (DAY_COUNT - index - 1));
    const key = date.toISOString().slice(0, 10);
    return { date: key, label: dateFormatter.format(date), orderCount: 0, revenue: 0 };
  });
  const dailyTotals = new Map(days.map((day) => [day.date, day]));
  const neighborhoodTotals = new Map();
  let revenue = 0;

  for (const order of orders) {
    const orderTotal = Number(order.total) || 0;
    if (order.status !== "cancelled") revenue += orderTotal;

    if (order.status !== "cancelled") {
      const label = neighborhoodLabel(order.neighborhood);
      const key = label.toLocaleLowerCase("en");
      const neighborhood = neighborhoodTotals.get(key) ?? { neighborhood: label, revenue: 0 };
      neighborhood.revenue += orderTotal;
      neighborhoodTotals.set(key, neighborhood);
    }

    const dateKey = new Date(order.createdAt).toISOString().slice(0, 10);
    const day = dailyTotals.get(dateKey);
    if (day) {
      day.orderCount += 1;
      if (order.status !== "cancelled") day.revenue += orderTotal;
    }
  }

  return {
    days,
    neighborhoods: [...neighborhoodTotals.values()].sort((left, right) => right.revenue - left.revenue),
    orderCount: orders.length,
    revenue,
  };
}

export function sortAndPageOrders(orders, { sort = "createdAt", direction = "desc", page = 1 } = {}) {
  const sortField = ORDER_SORT_FIELDS.includes(sort) ? sort : "createdAt";
  const sortDirection = direction === "asc" ? "asc" : "desc";
  const totalPages = Math.max(1, Math.ceil(orders.length / ORDERS_PAGE_SIZE));
  const currentPage = Math.min(Math.max(Number.parseInt(page, 10) || 1, 1), totalPages);
  const sortedOrders = [...orders].sort((left, right) => {
    const leftValue = sortField === "total" ? Number(left.total) : left[sortField];
    const rightValue = sortField === "total" ? Number(right.total) : right[sortField];
    const comparison = typeof leftValue === "number"
      ? leftValue - rightValue
      : String(leftValue).localeCompare(String(rightValue));
    return sortDirection === "asc" ? comparison : -comparison;
  });
  const start = (currentPage - 1) * ORDERS_PAGE_SIZE;

  return {
    orders: sortedOrders.slice(start, start + ORDERS_PAGE_SIZE),
    sort: sortField,
    direction: sortDirection,
    page: currentPage,
    totalPages,
    totalOrders: orders.length,
  };
}

export function getPreviewOrders(now = new Date()) {
  const neighborhoods = ["Bole", "Arada", "Piassa", "Kazanchis", "Lideta", "Bole"];
  const dishes = ["doro-wat", "kitfo", "tibs", "misir-wat"];
  const prices = [430, 460, 440, 320];
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  return Array.from({ length: 18 }, (_, index) => {
    const createdAt = new Date(today);
    createdAt.setUTCDate(today.getUTCDate() - (index % DAY_COUNT));
    createdAt.setUTCHours(8 + (index % 10), index * 3 % 60);
    const dishIndex = index % dishes.length;
    const quantity = (index % 3) + 1;

    return {
      id: `preview-order-${index + 1}`,
      createdAt: createdAt.toISOString(),
      neighborhood: neighborhoods[index % neighborhoods.length],
      dishId: dishes[dishIndex],
      quantity,
      total: prices[dishIndex] * quantity,
      status: index % 8 === 0 ? "cancelled" : index % 2 === 0 ? "delivered" : "received",
    };
  });
}