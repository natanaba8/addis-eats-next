# Route strategy plan

| Route | Strategy | Why |
| --- | --- | --- |
| `/` | Static | The landing page is evergreen marketing copy and can be cached at the edge for instant delivery. |
| `/about` | Static | The story and brand details are stable content that does not change per request. |
| `/menu` | Static with ISR (`revalidate = 60`) | The menu is mostly fixed, but a 60-second refresh window keeps specials current without sacrificing static performance. |
| `/menu/[id]` | Static with `generateStaticParams` | Each dish URL is known at build time and should be prerendered as its own page. |
| `/offers` | Static | Offer copy is lightweight marketing content and benefits from CDN caching. |
| `/checkout` | Dynamic (`force-dynamic`) | The checkout flow depends on request-scoped cart state and a `cookies()` read. |
| `/contact` | Static | Contact details are stable business information that can be served as static content. |
