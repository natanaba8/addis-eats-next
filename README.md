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

## API endpoints

| Endpoint | Method | Success | Error statuses |
| --- | --- | --- | --- |
| `/api/dishes` | GET | `200` | — |
| `/api/dishes/[id]` | GET | `200` | `404` |
| `/api/orders` | POST | `201` | `422` |

Dish reads return `{ "dishes": [...] }` or `{ "dish": {...} }`. Order requests use JSON fields `dishId`, `quantity`, and `customerName`. Invalid JSON or fields return `422` with the shared error envelope `{ "error": { "code": "...", "message": "...", "fieldErrors": {...} } }`.

Checkout submits through the `placeOrder` server action and uses the same validation schema as `POST /api/orders`. The action revalidates `/menu` and `/checkout` after writes. `cancelOrder` is also a server action; it requires a valid signed `session` cookie and checks the order's owner on the server before deleting it. Hiding or changing the cancel button does not change that check.

Set `SESSION_SECRET` in an ignored `.env.local` file. It must be a strong random value and must not use a `NEXT_PUBLIC_` prefix. A session cookie value is the user ID followed by a period and its lowercase hex HMAC-SHA256 signature, computed with `SESSION_SECRET`. This sample has no login/session-issuing flow; an authentication provider must issue that signed, HttpOnly cookie. Orders are held in process memory for this demo, so use a persistent database before deploying across multiple processes or serverless instances.

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
