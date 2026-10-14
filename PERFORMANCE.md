# Lighthouse Measurements

## Setup

- Lighthouse 13.5.0 against a production build of the app.
- Mobile form factor with Lighthouse's simulated throttling (`throttlingMethod: simulate`).
- Baseline source was copied to a temporary workspace so its production build did not conflict with the running development server.
- LCP and CLS are reported by Lighthouse. Lighthouse's navigation report did not include an INP audit, so INP is recorded as unavailable rather than estimated from another metric. TBT is included as context, not as a replacement for INP.

## Results

| Run | Change since previous run | LCP | CLS | INP | TBT |
| --- | --- | ---: | ---: | --- | ---: |
| Baseline | No changes | 2,630 ms | 0.000 | Not reported by Lighthouse navigation mode | 165 ms |
| After env template | Added `.env.example` and allowed only that file through `.gitignore` | 2,618 ms (-12 ms) | 0.000 (no change) | Not reported | 122 ms |
| Final rebuilt production app | Same runtime code; rebuilt after the env-file change | 2,577 ms (-41 ms from previous, -53 ms from baseline) | 0.000 (no change) | Not reported | 127 ms |

These runs had no application runtime optimization between them. The small LCP/TBT differences are normal run-to-run variation, not a demonstrated improvement from the environment-file change.

## Image, Font, and Script Review

- No `<img>` elements or other page image elements were found in `app/`, so there were no images to convert to `next/image`, no image dimensions or `sizes` to add, and no largest image to mark `priority`.
- `app/layout.js` already loads Geist using `next/font/google`; there was no font link tag to replace. Baseline CLS was already 0.000, so a CLS improvement cannot be demonstrated without changing the font setup.
- No third-party scripts were found in `app/`, so there were none to move to `next/script`.
- `.env.example` is trackable, while `.env.local` and `.env.production.local` remain ignored by Git.
