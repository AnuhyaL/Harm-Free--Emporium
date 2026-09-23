# Assets needed

Each missing asset has a palette-matched SVG/CSS placeholder today. Each is an isolated component, so swapping one in does not touch page code.

| Asset | Placeholder today | Where to drop the real one |
|---|---|---|
| **Hero video** | ✅ **Added.** `public/media/hfe.mp4` (1920×1080, 10 s, 13 MB, copied from `People_tending_regenerative_land…_1080p.mp4`) plus a poster frame `public/media/hfe-poster.jpg` taken from it. | **Recommended before launch:** re-encode to ~3–4 MB (H.264, CRF ~28) and add a VP9 `hfe.webm`, then list the WebM first in `DEFAULT_SOURCES` in `src/components/brand/HeroVideo.tsx`. 13 MB is heavy for a hero, and it now loads on every device including phones on mobile data (it starts after the page first paints, so it never blocks the page). If the final hands/flower/bees video arrives, replace these two files. |
| **Final logo** | `src/components/brand/Logo.tsx` (hands + sprout mark, Fraunces wordmark) and `public/favicon.svg` | Replace `LogoMark` / `Logo` with the final SVG. Also update the favicon. |
| **Mascot art — "Sol"** (solar-panel robot) | SVG in `src/components/brand/Mascot.tsx` with 4 states: `idle`, `push`, `checkout`, `success` | Pass Lottie/SVG per state through the `art` prop, or replace the `SolFigure` internals. Keep the four state names. |
| **Cornucopia illustration** | SVG horn with category glyphs, `src/components/brand/Cornucopia.tsx` | Pass final art through the `art` prop. |
| **Product photography** | Generated palette illustrations (`src/components/brand/ProductArt.tsx`) in 4 angles: front, detail, in-use, packaging | Set `images[].src` and `srcSet` (WebP/AVIF, 400/800/1600 w) on each product; `ProductImage` switches to `<img srcset>` automatically. |
| **Vendor logos** | Monogram circles | Add a `logo` field to `Vendor` and render it in Brands / Brand / marquee. |
| **Blog cover images** | Generated covers (`PostCover` in `src/components/content/ContentBits.tsx`) | Add `cover` to `Post`. |
| **EarthCoin artwork** | SVG coin (`EarthCoinArt`) | Replace with official EarthCoin art. |

## Open questions from the brief (§13), with the assumptions this build made

1. **Final logo and mascot name.** Built with a placeholder mark and the working name **"Sol"**. Both are one-file swaps.
2. **Light or dark default?** **Light is the default**, following the system preference unless the visitor toggles. Emerald/navy/gold is the dark theme. Flipping the default is a token change.
3. **Is `hfe.mp4` available, and at what resolution and length?** Not in this repo. The hero is wired and waiting; it shows the poster until the files exist.
4. **Real product/vendor names, or placeholders?** All products, vendors, reviews, certification IDs and patents are **invented sample data**, labeled "Sample" in the UI and at the top of every seed file. The 37 categories come verbatim from the HFE category sheet.
