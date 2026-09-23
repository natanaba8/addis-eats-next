# Addis Eats Next

This project demonstrates App Router strategy controls for a small restaurant site.

- static root and marketing pages
- nested menu layout with a persistent sidebar
- ISR menu route with a 60-second revalidation window
- static dish pages generated via `generateStaticParams`
- dynamic checkout route forced by a `cookies()` read
- Suspense boundary around the dish stream

## Strategy summary

See (STRATEGY.md) for the full route-by-route plan.

## Build output

Route (app)            Revalidate  Expire
/
 /_not-found
 /about
 /checkout
 /contact
 /menu                      
 /menu/[id]
 /menu/doro-wat
 /menu/kitfo
 /menu/tibs
 /menu/misir-wat
 /offers

```
