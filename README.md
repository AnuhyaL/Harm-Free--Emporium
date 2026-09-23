# HarmFree Emporium (HFE) — website, phase one

*HarmFree to Humans, Animals, Plants, and Planets.*

This is the complete storefront as a React app. Every page and flow works end to end against a local mock API with seeded sample data. There is no backend, no real payment processor and no deployment config in this phase.

## Setup

Requires Node 18+ (tested on Node 24).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

## Demo credentials

| Email | Password |
|---|---|
| `demo@harmfree.example` | `harmfree` |

The demo account comes seeded with three orders in different tracking states, points history, two reviews and one EarthCoin. You can also sign up with any email; accounts live only in your browser's localStorage.

To start over, go to **Account → Profile & addresses → Reset demo data**.

## Test cards (simulated payments)

| Number | Result |
|---|---|
| `4242 4242 4242 4242` | Visa — approved |
| `5555 5555 5555 4444` | Mastercard — approved |
| `3782 822463 10005` | Amex — approved (4-digit CVC) |
| `4000 0000 0000 0002` | Declined |
| `4000 0000 0000 9995` | Insufficient funds |

Use any future expiry and any CVC. The form validates with a Luhn check, an expiry check and a brand-aware CVC length check. Card numbers never leave the form component; only `{ brand, last4, outcome }` reaches the mock API.

## Promo codes

`HARMFREE10` (10% off), `EARTHDAY` ($5 off orders of $25+), `WELCOME15` (15% off).

## Things to try

- **Order tracking.** Orders placed in the demo advance through Placed → Vendor Confirmed → Packed → Shipped → Out for Delivery → Delivered over about 15 minutes. Seeded orders use real-world timing.
- **Returns.** Order `HFE-100231` shows one vendor's return window still open and one closed.
- **Rewards.** Write a review on a product to earn 50 points (+100 with photo/video). Every fifth review earns an EarthCoin.
- **Donations.** A $30+ donation while signed in records an EarthCoin.
- **Themes.** Use the header theme toggle to cycle system → light → dark.

## Stack

React 18, TypeScript, Vite, React Router 6 (route-level code splitting), Tailwind CSS (semantic tokens), Radix UI, Zustand (persisted), React Hook Form + Zod, Framer Motion, react-helmet-async.

## Project map

```
src/
  api/          mock API — the only data boundary (swap for HTTP later)
  data/         SAMPLE seed data: categories (from the HFE sheet), vendors, products, reviews, posts, policies
  lib/          pricing engine, order/tracking logic, payment validation, hooks
  store/        Zustand stores: cart, auth session, wishlist, UI/theme
  components/
    brand/      swappable brand pieces: Mascot (Sol), HeroVideo, Cornucopia, Logo, ProductArt
    ui/ layout/ product/ cart/ content/
  pages/        one file per route
  styles/       tokens.css holds every color (light + dark)
```

## Design tokens

All colors are CSS custom properties in `src/styles/tokens.css`. They are redefined for `prefers-color-scheme: dark` and for `[data-theme="dark"]`. Components use semantic Tailwind names (`bg-surface`, `text-muted`, `bg-primary`…) and never raw hex.

The current palette is the client-supplied **Ivory & Forest** set: Warm Ivory `#FAF9F5`, Soft Sage `#EEF2EA`, Deep Forest Green `#294438`, Sage Green `#879B86`, Soft Terracotta `#C98268`, Warm Sand `#D8C7A5`, Charcoal `#252A27`, Muted Gray `#68706A`, and white. Contrast ratios are documented at the top of `tokens.css`. Terracotta and Sage Green serve as fills and accents only, because as small text on light backgrounds they fall below WCAG AA.

To change the palette again, edit the values in `tokens.css` only.

## Related docs

- `ASSETS_NEEDED.md` — placeholder art to replace
- `BACKEND_NEEDED.md` — every place a real service is needed
- Open questions and assumptions are listed at the bottom of `ASSETS_NEEDED.md`
