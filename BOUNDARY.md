# Boundary map

| Component | Runs on | Justification |
| --- | --- | --- |
| `app/layout.js` | Server | It owns the root HTML/body, imports global CSS, and passes server-rendered children into the client wrapper without creating callback props. |
| `app/components/Providers.js` | Client | This is the smallest client shell needed to wrap the app and receive server-rendered children. |
| `app/components/Navigation.js` | Server | It only renders links and static navigation markup, so it remains server-side. |
| `app/menu/layout.js` | Server | It composes the persistent menu shell and passes `children` into the nested layout without client-only behavior. |
| `app/menu/components/MenuSidebar.js` | Client | It uses `usePathname` and `useState`, so the interactive sidebar is the narrowest client boundary. |
| `app/menu/page.js` | Server | The route is an async server component that streams the dish list behind Suspense and uses no fetching hooks. |
| `app/menu/[id]/page.js` | Server | The dynamic dish page is async, static at build time through `generateStaticParams`, and has no client-only logic. |
| `app/menu/components/MenuList.js` | Server | It renders static menu data for the server stream and does not need browser APIs. |
| `app/checkout/page.js` | Server | The checkout route is intentionally forced dynamic because it reads request-scoped cookie state. |
