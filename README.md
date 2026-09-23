# Addis Eats Next

This project demonstrates App Router strategy controls for a small restaurant site.

- static root and marketing pages
- nested menu layout with a persistent sidebar
- ISR menu route with a 60-second revalidation window
- static dish pages generated via `generateStaticParams`
- dynamic checkout route forced by a `cookies()` read
- Suspense boundary around the dish stream
- server/client boundary split with a client `Providers` shell and a focused `MenuSidebar` client island

## Strategy summary

See (STRATEGY.md) for the full route-by-route plan.

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
