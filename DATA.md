# Data Queries

All client-side SWR queries use the shared `fetcher` in `app/menu/lib/fetcher.js`. It sends requests with `cache: "no-store"` and throws for any non-OK response so SWR receives errors consistently.

| Query | Key | Refresh rule | Reason |
| --- | --- | --- | --- |
| Server-rendered menu page | `/menu?q=<term>&page=<number>` (empty `q` is omitted; page defaults to `1`) | Loaded on each server navigation/request; no interval polling. | The URL fully identifies a shareable search/page view, and the server sends matching first-paint data. |
| Client dish search/page | `null` when the debounced term is empty; otherwise `/api/dishes?q=<encoded-term>&page=<number>` | Fetch on key change; focus revalidation is disabled; no timer. Exact server data is supplied as `fallbackData` on matching query/page, and `keepPreviousData` keeps rows visible during a changed key. | Empty search uses the server-rendered page without a redundant request; non-empty search is debounced and keyed by term and page to prevent response races. |
| Client order status | `/api/orders/<order-id>` | Poll every `5000` ms and revalidate on focus; the server-rendered status is supplied as `fallbackData`. | The first response is already rendered by the server, while the short poll interval surfaces later status changes without a loading flash. |

`GET /api/dishes` accepts `q` and `page` query parameters and returns the matching page plus pagination metadata. `GET /api/orders/[id]` returns only the status reference and creation time; unknown IDs return `404` with the shared error shape.

The order-status route is `/orders/[id]`; its ID comes from the successful `placeOrder` action response.
