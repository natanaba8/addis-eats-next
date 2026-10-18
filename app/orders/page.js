import Link from "next/link";
import { redirect } from "next/navigation";
import { etb, when } from "../../lib/format.js";
import { getSession } from "../menu/lib/session";
import { listOrdersForOwner } from "../menu/lib/orders";
import { findDish } from "../menu/lib/dishes";
import OrdersCharts from "./OrdersCharts";
import {
  getDashboardState,
  sortAndPageOrders,
  summarizeOrders,
} from "./dashboard-data";

export const metadata = {
  title: "Your orders",
  description: "Review your recent orders, daily order activity, and revenue.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function queryHref({ sort, direction, page }) {
  const params = new URLSearchParams();
  if (sort !== "createdAt") params.set("sort", sort);
  if (direction !== "desc") params.set("direction", direction);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/orders?${query}` : "/orders";
}

function SortHeader({ field, label, currentSort, direction }) {
  const nextDirection = currentSort === field && direction === "desc" ? "asc" : "desc";
  const ariaSort = currentSort === field
    ? direction === "asc" ? "ascending" : "descending"
    : undefined;

  return (
    <th scope="col" aria-sort={ariaSort} className={field === "total" ? "numeric-cell" : undefined}>
      <Link
        href={queryHref({ sort: field, direction: nextDirection, page: 1 })}
        className="table-sort-link"
      >
        {label}
        {currentSort === field ? <span aria-hidden="true">{direction === "asc" ? " ↑" : " ↓"}</span> : null}
      </Link>
    </th>
  );
}

function OrdersTable({ orders, sort, direction }) {
  return (
    <div className="data-table-scroll">
      <table className="orders-table">
        <caption>Orders for your account on this page, sorted by {sort} {direction === "asc" ? "ascending" : "descending"}.</caption>
        <thead>
          <tr>
            <SortHeader field="createdAt" label="Placed" currentSort={sort} direction={direction} />
            <SortHeader field="dishId" label="Dish" currentSort={sort} direction={direction} />
            <SortHeader field="status" label="Status" currentSort={sort} direction={direction} />
            <th scope="col" className="numeric-cell">Quantity</th>
            <SortHeader field="total" label="Total (ETB)" currentSort={sort} direction={direction} />
          </tr>
        </thead>
        <tbody>
          {orders.length ? orders.map((order) => (
            <tr key={order.id}>
              <td>
                <Link href={`/orders/${order.id}`} className="text-link">
                  <time dateTime={order.createdAt}>{when(order.createdAt)}</time>
                </Link>
              </td>
              <td>{order.dishId}</td>
              <td>{order.status}</td>
              <td className="numeric-cell">{order.quantity}</td>
              <td className="numeric-cell">{etb(order.total)}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5" className="table-empty-cell">No orders to display yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function OrdersPagination({ page, totalPages, sort, direction }) {
  if (totalPages < 2) return null;

  return (
    <nav className="orders-pagination" aria-label="Order pages">
      {page > 1 ? (
        <Link
          href={queryHref({ sort, direction, page: page - 1 })}
          className="secondary-button"
          rel="prev"
        >
          Previous page
        </Link>
      ) : <span aria-hidden="true" />}
      <span aria-current="page">Page {page} of {totalPages}</span>
      {page < totalPages ? (
        <Link
          href={queryHref({ sort, direction, page: page + 1 })}
          className="secondary-button"
          rel="next"
        >
          Next page
        </Link>
      ) : <span aria-hidden="true" />}
    </nav>
  );
}

export default async function OrdersPage({ searchParams }) {
  const session = await getSession();
  if (!session) redirect("/sign-in?next=%2Forders");

  const params = await searchParams;
  const sourceOrders = listOrdersForOwner(session.id).map((order) => ({
    ...order,
    total: (findDish(order.dishId)?.price ?? 0) * order.quantity,
  }));
  const summary = summarizeOrders(sourceOrders);
  const state = getDashboardState({ orders: sourceOrders });
  const pageData = sortAndPageOrders(sourceOrders, {
    sort: params?.sort,
    direction: params?.direction,
    page: params?.page,
  });

  return (
    <main className="page-shell">
      <section className="route-card orders-dashboard">
        <p className="eyebrow">Your account</p>
        <h1>Your orders</h1>

        <div className="orders-summary" aria-label="Order summary">
          <div>
            <span>Total orders</span>
            <strong>{summary.orderCount}</strong>
          </div>
          <div>
            <span>Revenue, excluding cancellations</span>
            <strong>{etb(summary.revenue)}</strong>
          </div>
        </div>

        {state === "empty" ? (
          <p className="orders-empty-state" role="status">
            No orders yet. Your order activity and revenue charts will appear here when you place an order.{" "}
            <Link href="/menu" className="text-link">Explore the menu</Link>
          </p>
        ) : null}

        <OrdersCharts days={summary.days} />

        <section className="orders-list-section" aria-labelledby="orders-list-title">
          <div className="orders-list-heading">
            <h2 id="orders-list-title">Order history</h2>
            <p>{pageData.totalOrders} {pageData.totalOrders === 1 ? "order" : "orders"}</p>
          </div>
          <OrdersTable
            orders={pageData.orders}
            sort={pageData.sort}
            direction={pageData.direction}
          />
          <OrdersPagination
            page={pageData.page}
            totalPages={pageData.totalPages}
            sort={pageData.sort}
            direction={pageData.direction}
          />
        </section>
      </section>
    </main>
  );
}