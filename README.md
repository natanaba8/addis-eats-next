# Addis Eats Next

This project demonstrates App Router strategy controls for a small restaurant site.

- static root and marketing pages
- nested menu layout with a persistent sidebar
- ISR menu route with a 60-second revalidation window
- static dish pages generated via `generateStaticParams`
- dynamic checkout route forced by a `cookies()` read
- Suspense boundary around the dish stream
- server/client boundary split with a client `Providers` shell and a focused `MenuSidebar` client island
- shared dish and order-validation modules used by the API routes and checkout server action

## Strategy summary

See (STRATEGY.md) for the full route-by-route plan.

See [DATA.md](DATA.md) for query keys, fallback behavior, and refresh rules.

## API endpoints

| Endpoint | Method | Success | Error statuses |
| --- | --- | --- | --- |
| `/api/dishes` | GET | `200` | — |
| `/api/dishes/[id]` | GET | `200` | `404` |
| `/api/orders` | GET, POST | `200`, `201` | `401`, `422` |
| `/api/orders/[id]` | GET | `200` | `401`, `404` |

Dish reads return `{ "dishes": [...] }` or `{ "dish": {...} }`; `GET /api/dishes` accepts optional `q` and `page` parameters and returns page metadata. Order requests use JSON fields `dishId`, `quantity`, `customerName`, and `deliveryAddress`; an optional `neighborhood` is stored explicitly, otherwise it is inferred from a conventional comma-separated address or recorded as `Unspecified`. Invalid JSON or fields return `422` with the shared error envelope `{ "error": { "code": "...", "message": "...", "fieldErrors": {...} } }`.

Checkout submits through the `placeOrder` server action and uses the same validation schema as `POST /api/orders`. Both require a valid signed session. `cancelOrder` checks the order owner on the server before changing status. `/orders` and the order detail API/page return only orders owned by the signed-in account. `/kitchen` checks the session's server-resolved staff role before rendering any orders.

Set `SESSION_SECRET` and `AUTH_USERS` in an ignored `.env.local` file. `SESSION_SECRET` must be a strong random value and neither variable should use a `NEXT_PUBLIC_` prefix. `AUTH_USERS` is a JSON array of configured accounts; for example: `[ { "id": "customer-1", "password": "replace-me", "role": "customer" }, { "id": "staff-1", "password": "replace-me-too", "role": "staff" } ]`. Sign-in checks these credentials on the server. Roles are resolved from this server-side configuration, so a form value cannot grant staff access. The `session` cookie contains the account ID and its HMAC-SHA256 signature; it is HttpOnly, Secure, SameSite=Strict, and expires after seven days.

The proxy matcher covers only `/checkout` and `/orders` and their descendants. Pages, actions, and APIs still verify the signed session themselves. The `next` destination is restricted to a same-origin path before redirecting. Orders are held in process memory for this demo, so use a persistent database before deploying across multiple processes or serverless instances.

## Orders Dashboard

The authenticated `/orders` page aggregates neighbourhood revenue and the last seven days of order counts on the server. To demonstrate each dashboard state without changing account data, open `/orders?previewState=loading`, `/orders?previewState=empty`, `/orders?previewState=error`, or `/orders?previewState=populated`. The populated preview uses clearly labelled synthetic data. Sorting and paging use `sort`, `direction`, and `page` query parameters.

## First Load JS for /menu

The client island was narrowed to the sidebar-only interaction, while the menu content stays server-rendered and streamed behind a Suspense boundary.

## Build output

```text
> addis-eats-next@0.1.0 build
> next build

▲ Next.js 16.3.5 (Turbopack)
✓ Running next.config.mjs took 74ms

  Creating an optimized production build ...
✓ Compiled successfully in 6.0s
✓ Finished TypeScript in 7ms
✓ Collecting page data using 7 workers in 2.8s
✓ Generating static pages using 7 workers (11/11) in 978ms
✓ Finalizing page optimization in 37ms

Route (app)            Revalidate  Expire
┌   /
├   /_not-found
├   /about
├   /checkout
├   /contact
├   /menu                      1m      1y
├   /menu/[id]
│ /menu/doro-wat
│ /menu/kitfo
│ /menu/tibs
│ /menu/misir-wat
└ /offers


```
