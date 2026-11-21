# BrandSeoTools — Membership Platform Redesign (Static Mockup)

A complete front-end design prototype of a tools-membership platform:
87-product catalogue, subscriptions, billing, auth flows, support and a
browser-extension install flow — built as plain HTML/CSS/vanilla JS with
local dummy data only. No backend.

**Live preview:** https://vinothpraba347.github.io/brandseotools-mockup/

## Pages
`index.html` landing · `login.html` · `signup.html` (3-step: account → tool picker → checkout) · `forgot-password.html` · `dashboard.html` · `products.html` (catalogue) · `product-details.html?slug=<slug>` · `subscriptions.html` · `billing.html` · `profile.html` (settings) · `support.html` · `extension.html`

## Structure
```
assets/css/styles.css      design system + layout
assets/js/app.js           shared shell + page logic
assets/js/mock-data.js     dummy data (87 real product names)
assets/js/icons.js         lucide icon set (local, offline-safe)
assets/js/product-images.js  brand-logo map (generated)
assets/images/products/    local brand assets
```
Everything runs from `file://` or any static host — no build step.

Docs: `PRODUCT_IMAGE_MAPPING.md` (logo provenance), `MOCKUP-TO-REACT-PROMPT.md` (spec for the React port).
