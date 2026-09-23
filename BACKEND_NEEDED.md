# Backend needed (phase two)

Components only call `api.*` in `src/api/index.ts`. Each function returns a Promise of a typed result from `src/types`. To go live, reimplement these functions with HTTP calls and keep the signatures; no component changes are needed.

`src/api/client.ts` holds the transport helpers (`ApiError`, and the `session` token that stands in for an auth cookie or bearer header).

| Area | Mock today | Real service needed |
|---|---|---|
| **Catalog & search** — `api.catalog.*` | In-memory filter, facet counts and relevance scoring over `src/data/products.ts` | Product DB + search index (facets, typo tolerance). Admin/vendor portal to manage listings. |
| **Vendors** — `api.vendors.*` | Static fixtures | Vendor DB, onboarding state, payout accounts (out of scope). |
| **Auth** — `api.auth.*` | Users in localStorage (`hfe-db-v1`) with plaintext demo passwords; random session token | Real identity provider: hashed passwords/SSO, httpOnly session cookies, email verification, password reset emails, rate limiting. CRM sync (e.g. Salesforce) per the vision doc. |
| **Addresses / profile** — `api.auth.saveAddress/updateProfile` | localStorage | User service with address validation. |
| **Payments** — `api.payments.authorize` | Test-card outcomes after a 1.1 s delay; only brand/last4 are seen | Payment processor (e.g. Stripe) with client-side tokenization. Swap `PaymentForm` for the processor's hosted fields. Never send raw card data to our servers. |
| **Orders** — `api.orders.place/list/get` | Server recomputes totals with the shared `lib/pricing.ts` engine and splits the order into one shipment per vendor. Tracking events are pre-scheduled timestamps. | Order service + tax service (currently a flat 5% estimate) + vendor order routing + transactional email (confirmation copy). Guest order lookup needs a signed link instead of a bare id. |
| **Tracking** — `lib/orders.ts` | Stage derived from scheduled mock events | Carrier APIs/webhooks (UPS, USPS, FedEx…) writing real events. |
| **Returns** — `api.returns.*` | Creates an RMA record, marked forwarded to vendor | Vendor notification/ticketing, return labels, refund/credit handling by the vendor. |
| **Reviews** — `api.reviews.*` | Sample reviews + user reviews in localStorage; media upload is only a flag | Review service with moderation and media storage. Sample reviews must be removed before launch. |
| **Loyalty** — `api.loyalty.get` | Balance computed from points transactions | Points ledger service (idempotent awards, reversals on returns, expiry rules). |
| **EarthCoin** — `recordEarthCoin` in the API | Entitlement recorded with a serial; no minting | Entitlement registry; optional on-chain minting and wallet linking later (explicitly out of scope). |
| **Donations** — `api.donations.create` | Simulated payment + receipt number | Non-profit donation processor issuing tax receipts for Green2Gold. |
| **Forms** — `api.forms.contact/newsletter/vendorApplication` | Stored locally; vendor application files never leave the browser | Helpdesk/CRM, email marketing platform, and document storage for vendor lab results and sell sheets. |
| **Impact stats** — `api.stats.impact` | Computed from the sample catalog and demo data | Analytics warehouse; the analytics dashboard is out of scope. |

## Also for later phases

SSR/Next.js + JSON-LD, test suites and CI, hosting/monitoring, security hardening, live chat, and the admin console / vendor portal.
