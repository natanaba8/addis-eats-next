import Link from "next/link";
import { redirect } from "next/navigation";
import { etb, when } from "../../lib/format.js";
import { getSession } from "../menu/lib/session";
import { listOrdersForOwner } from "../menu/lib/orders";
import { findDish } from "../menu/lib/dishes";
import { normalizeNeighborhood } from "../menu/lib/neighborhood";
import { signOut } from "../sign-in/actions";
import OrdersCharts from "./OrdersCharts";
import {
  DASHBOARD_PREVIEW_STATES,
  getDashboardState,
  getPreviewOrders,
  sortAndPageOrders,
  summarizeOrders,
} from "./dashboard-data";

export const metadata = {
  title: "Your orders",
  description: "Review your recent orders, daily order activity, and revenue.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function queryHref({ sort, direction, page, previewState }) {
  const params = new URLSearchParams();
  if (previewState) params.set("previewState", previewState);
  if (sort !== "createdAt") params.set("sort", sort);
  if (direction !== "desc") params.set("direction", direction);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/orders?${query}` : "/orders";
}

function SortHeader({ field, label, currentSort, direction, previewState }) {
  const nextDirection = currentSort === field && direction === "desc" ? "asc" : "desc";
  const ariaSort = currentSort === field
    ? direction === "asc" ? "ascending" : "descending"
    : undefined;

  return (
    <th scope="col" aria-sort={ariaSort} className={field === "total" ? "numeric-cell" : undefined}>
      <Link
        href={queryHref({ sort: field, direction: nextDirection, page: 1, previewState })}
        className="table-sort-link"
      >
        {label}
        {currentSort === field ? <span aria-hidden="true">{direction === "asc" ? " ↑" : " ↓"}</span> : null}
      </Link>
    </th>
  );
}

function OrdersTable({ orders, sort, direction, previewState }) {
  const isPreview = Boolean(previewState);
  return (
    <div className="data-table-scroll">
      <table className="orders-table">
        <caption>{isPreview ? "Preview orders" : "Orders for your account"} on this page, sorted by {sort} {direction === "asc" ? "ascending" : "descending"}.</caption>
        <thead>
          <tr>
            <SortHeader field="createdAt" label="Placed" currentSort={sort} direction={direction} previewState={previewState} />
            <SortHeader field="dishId" label="Dish" currentSort={sort} direction={direction} previewState={previewState} />
            <SortHeader field="neighborhood" label="Neighbourhood" currentSort={sort} direction={direction} previewState={previewState} />
            <SortHeader field="status" label="Status" currentSort={sort} direction={direction} previewState={previewState} />
            <th scope="col" className="numeric-cell">Quantity</th>
            <SortHeader field="total" label="Total (ETB)" currentSort={sort} direction={direction} previewState={previewState} />
          </tr>
        </thead>
        <tbody>
          {orders.length ? orders.map((order) => (
            <tr key={order.id}>
              <td>{isPreview ? (
                <time dateTime={order.createdAt}>{when(order.createdAt)}</time>
              ) : (
                <Link href={`/orders/${order.id}`} className="text-link">
                  <time dateTime={order.createdAt}>{when(order.createdAt)}</time>
                </Link>
              )}</td>
              <td>{order.dishId}</td>
              <td>{order.neighborhood}</td>
              <td>{order.status}</td>
              <td className="numeric-cell">{order.quantity}</td>
              <td className="numeric-cell">{etb(order.total)}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" className="table-empty-cell">No orders to display yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function OrdersPagination({ page, totalPages, sort, direction, previewState }) {
  if (totalPages < 2) return null;

  return (
    <nav className="orders-pagination" aria-label="Order pages">
      {page > 1 ? (
        <Link
          href={queryHref({ sort, direction, page: page - 1, previewState })}
          className="secondary-button"
          rel="prev"
        >
          Previous page
        </Link>
      ) : <span aria-hidden="true" />}
      <span aria-current="page">Page {page} of {totalPages}</span>
      {page < totalPages ? (
        <Link
          href={queryHref({ sort, direction, page: page + 1, previewState })}
          className="secondary-button"
          rel="next"
        >
          Next page
        </Link>
      ) : <span aria-hidden="true" />}
    </nav>
  );
}

function DashboardPreviewState({ state }) {
  const isError = state === "error";
  const message = state === "loading"
    ? "Loading order dashboard preview..."
    : "The dashboard error state is being previewed. Your order data has not changed.";

  return (
    <main className="page-shell">
      <section className="route-card dashboard-state-preview">
        <p className="eyebrow">Dashboard state preview</p>
        <h1>Orders dashboard: {state}</h1>
        <p role={isError ? "alert" : "status"}>{message}</p>
        <nav className="dashboard-preview-links" aria-label="Dashboard state previews">
          {DASHBOARD_PREVIEW_STATES.map((preview) => (
            <Link
              key={preview}
              href={`/orders?previewState=${preview}`}
              className={preview === state ? "secondary-button" : "text-link"}
              aria-current={preview === state ? "page" : undefined}
            >
              {preview}
            </Link>
          ))}
        </nav>
        <Link href="/orders" className="text-link">Return to live orders</Link>
      </section>
    </main>
  );
}

export default async function OrdersPage({ searchParams }) {
  const session = await getSession();
  if (!session) redirect("/sign-in?next=%2Forders");

  const params = await searchParams;
  const requestedPreview = typeof params?.previewState === "string" ? params.previewState : null;
  const previewState = DASHBOARD_PREVIEW_STATES.includes(requestedPreview) ? requestedPreview : null;
  if (previewState === "loading" || previewState === "error") {
    return <DashboardPreviewState state={previewState} />;
  }

  const isPreview = Boolean(previewState);
  const selectedOrders = previewState === "empty"
    ? []
    : previewState === "populated"
      ? getPreviewOrders()
      : listOrdersForOwner(session.id);
  const sourceOrders = selectedOrders.map((order) => ({
    ...order,
    neighborhood: normalizeNeighborhood(order.neighborhood, order.deliveryAddress),
    total: Number(order.total ?? (findDish(order.dishId)?.price ?? 0) * order.quantity),
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
        <form action={signOut} className="cta-row">
          <p>Signed in as <strong>{session.id}</strong></p>
          <button className="secondary-button" type="submit">Sign out</button>
        </form>
        {isPreview ? (
          <>
            <p className="orders-preview-note" role="status">Preview data only. No account orders are created or changed.</p>
            <nav className="dashboard-preview-links" aria-label="Dashboard state previews">
              {DASHBOARD_PREVIEW_STATES.map((preview) => (
                <Link
                  key={preview}
                  href={`/orders?previewState=${preview}`}
                  className={preview === previewState ? "secondary-button" : "text-link"}
                  aria-current={preview === previewState ? "page" : undefined}
                >
                  {preview}
                </Link>
              ))}
            </nav>
          </>
        ) : null}

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
            {isPreview ? "This preview has no orders. Your real account data has not changed." : (
              <>No orders yet. Your order activity and revenue charts will appear here when you place an order.{" "}
                <Link href="/menu" className="text-link">Explore the menu</Link>
              </>
            )}
          </p>
        ) : null}

        <OrdersCharts days={summary.days} neighborhoods={summary.neighborhoods} />

        <section className="orders-list-section" aria-labelledby="orders-list-title">
          <div className="orders-list-heading">
            <h2 id="orders-list-title">Order history</h2>
            <p>{pageData.totalOrders} {pageData.totalOrders === 1 ? "order" : "orders"}</p>
          </div>
          <OrdersTable
            orders={pageData.orders}
            sort={pageData.sort}
            direction={pageData.direction}
            previewState={previewState}
          />
          <OrdersPagination
            page={pageData.page}
            totalPages={pageData.totalPages}
            sort={pageData.sort}
            direction={pageData.direction}
            previewState={previewState}
          />
        </section>
      </section>
    </main>
  );
}