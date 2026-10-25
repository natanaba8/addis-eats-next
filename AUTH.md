# Authentication and Authorization

This is my map of which parts of the app check a user's session and what each check does.

## Session and Sign-In

`getSession()` in `app/menu/lib/session.js` reads the `session` cookie. It checks the cookie's signature using `SESSION_SECRET` and confirms the account is still listed in `AUTH_USERS`. It returns the account's `id` and `role`, or `null` if the session is not valid. The server looks up the role; the browser cannot choose it.

The sign-in action in `app/sign-in/actions.js` checks the account ID and password against `AUTH_USERS`. If they match, it sets a signed cookie with `httpOnly` and `sameSite: "lax"`, plus `secure` in production (so sign-in also works over plain http during local development). The cookie is valid for seven days. The `signOut` action deletes the cookie; the `/orders` page shows a sign-out button.

## Protected Routes

| Route | Checks | Why |
| --- | --- | --- |
| `GET /checkout` | `proxy.js` redirects if there is no session cookie. `app/checkout/page.js` calls `getSession()` while rendering. | The proxy handles the early redirect. The page checks that the cookie is valid and belongs to a configured account. |
| Checkout order actions | `placeOrder` and `cancelOrder` in `app/checkout/actions.js` each check the session. `cancelOrder` also checks the order owner. | A new order is assigned to the signed-in account. A user can cancel only their own order. |
| `GET /orders` | The proxy redirects if there is no cookie. `app/orders/page.js` calls `getSession()` and lists orders using that session's id. | Each account sees only its own orders. |
| `GET /orders/[id]` | The proxy covers this path. `app/orders/[id]/page.js` checks the session and looks up the order for that session id. The status API repeats the check. | A user can see and refresh only their own order. Another account's order looks the same as a missing order. |
| `GET /api/orders` | `app/api/orders/route.js` checks the session and lists orders for that session id. | The API returns only the signed-in account's orders. It returns `401` without a valid session. |
| `POST /api/orders` | `app/api/orders/route.js` checks the session before creating an order and sets its owner to that session id. | A direct API call cannot create an anonymous order or set a different owner. |
| `GET /api/orders/[id]` | `app/api/orders/[id]/route.js` checks the session and looks up the order for that session id. | A user cannot read another account's order. The API returns `401` without a valid session and `404` for a missing or other user's order. |
| `GET /kitchen` | `app/kitchen/page.js` calls `getSession()` and checks for the `staff` role before loading orders. | Only an account configured as staff can see the kitchen queue. |
| `GET /menu/new` | `app/menu/new/page.js` calls `getSession()`. It redirects to sign-in without a session and returns `404` unless the role is `admin`. | Only an administrator can open the add-dish form. The sidebar link is visible to everyone, but the page does the real check. |
| `createDish` action | `app/menu/new/actions.js` checks the session's server-resolved `admin` role before validating and saving the dish. | A direct action call cannot add a dish without an admin session; the form cannot send a role. |

The **Login** link in the top navigation opens `/sign-in`. A signed-in visitor who opens it without a `next` value sees their account, role-specific links, and a sign-out button instead of the form.

The proxy matcher is limited to `/checkout/:path*` and `/orders/:path*`. It only checks whether a cookie is present; it does not prove that the cookie is valid. Pages, actions, and APIs do their own session checks, so they remain protected even when called directly.

## Return Destination

The app carries the requested page in the `next` parameter when sending someone to sign-in. `app/menu/lib/redirects.js` checks that value on the sign-in page and again before redirecting after sign-in. It allows a local path and rejects external URLs, protocol-relative URLs, backslashes, and control characters. Rejected values go to `/`.

## Configuration

Set `SESSION_SECRET` and `AUTH_USERS` in `.env.local`. Keep them on the server; do not use a `NEXT_PUBLIC_` prefix. `AUTH_USERS` is a JSON list of accounts with an `id`, a `password`, and an optional `role`. Use `"staff"` for kitchen staff and `"admin"` for administrators who can add dishes; any other value is treated as a customer. This demo keeps orders and admin-added dishes in memory, so a production deployment needs a persistent database.
