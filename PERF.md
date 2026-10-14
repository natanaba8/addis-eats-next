# Production Performance Notes

## How I Measured

I used Lighthouse 13.5.0 against production builds, with mobile form factor and simulated throttling. I built the baseline from an isolated copy so I would not overwrite the `.next` directory used by the running development server. The initial production build and Lighthouse JSON report were saved before changing the app.

Lighthouse navigation reports LCP, CLS, and TBT, but this run did not include an INP audit. INP is marked unavailable; TBT is shown as extra context and is not presented as INP.

## Results

| Production build | Change from previous | LCP | CLS | INP | TBT |
| --- | --- | ---: | ---: | --- | ---: |
| Before changes | Original production app | 2,630 ms | 0.000 | Not reported | 165 ms |
| After env example | Added `.env.example`; allowed that one file through `.gitignore` | 2,618 ms (-12 ms) | 0.000 | Not reported | 122 ms |
| After homepage markup fix | Closed an invalid nested `<p>` that caused a React hydration error | 2,565 ms (-53 ms) | 0.000 | Not reported | 116 ms |
| After priority hero image, first run | Added one local 42 KB WebP image | 2,825 ms (+260 ms) | 0.000 | Not reported | 141 ms |
| Same image build, repeat run | No code change; repeat to check variability | 2,608 ms (-217 ms) | 0.000 | Not reported | 50 ms |
| After reducing image bytes | Re-encoded the same image at 29 KB | 2,761 ms (+153 ms) | 0.000 | Not reported | 139 ms |

The numbers vary substantially between Lighthouse runs: the identical image build differed by 217 ms in LCP. The environment-file edit does not affect page rendering, so its small metric changes are measurement noise. Fixing the nested paragraph removed the hydration error seen in the baseline browser run; the lower LCP/TBT in that run is encouraging but should not be treated as a guaranteed speedup. The image is about 31% smaller after re-encoding, but these measurements do not show a reliable LCP improvement from adding it. CLS remained at zero in every run.

## Asset and Setup Checks

- The homepage has exactly one `next/image`: a locally hosted 1000×700 WebP. It declares `width`, `height`, responsive `sizes`, and descriptive alt text. It is the only image marked `priority`.
- There are no remote image hosts; the image is local, so `next.config.mjs` does not need a remote host allowlist.
- `app/layout.js` already loads Geist with `next/font/google`, which self-hosts the font in the production build. There was no `<link>` font tag to replace, so I left the working font setup unchanged. CLS was already zero in the baseline.
- I found no third-party scripts in `app/`, so there was no external script to move to `next/script` or defer.
- `.env.example` is available as a committed template. Git ignores `.env.local` and `.env.production.local`; only `.env.example` is unignored. The example uses placeholder values. The app's server environment variables are `SESSION_SECRET` and `AUTH_USERS`; neither is prefixed with `NEXT_PUBLIC_`.
