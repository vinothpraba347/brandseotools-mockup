# DESIGN_DIRECTION.md — Selected Visual Direction

## Decision: **E — Custom Hybrid: "Restrained SaaS-Commerce"**

Foundation: **Stripe-grade professionalism** (trust, density, typographic discipline) **+ marketplace discovery patterns** (catalogue ergonomics for 87 products) **+ Linear-grade interaction details** (menus, states, keyboard-first feel).

I am NOT recommending A, B, C or D in pure form. Here's why each falls short alone:

| Direction | Why insufficient alone |
|---|---|
| A. Premium Minimal (Linear/Vercel) | Optimized for issue-tracking/marketing sites, not a *store + membership utility*. Linear's sparse hero-driven aesthetic under-serves a pay-per-tool catalogue and INR billing tables. |
| B. Marketplace (G2/Product Hunt) | Discovery-first but billing/access is an afterthought — this product's *retention* flows (expiry, renew, access) are the core, not discovery. Marketplace chrome (reviews, ratings, feeds) doesn't exist here. |
| C. Business SaaS (Stripe/Notion) | Closest fit — but Stripe's docs-console density is colder than needed for a consumer catalogue; Notion's doc-metaphor doesn't apply. Needs the marketplace layer for browsing. |
| D. Productivity (Raycast) | Command-palette density is hostile to mainstream users browsing a shop; works as an accent (⌘K search) not the whole product. |

## Why the hybrid wins *for this specific product*

The platform is **two products in one**:

1. **A store** — 87 tools, per-tool 30-day pricing, discovery, categories, bundles. This needs marketplace ergonomics: scannable cards/lists, status badges, quick CTAs, real brand logos.
2. **A utility** — "what do I own, when does it die, let me in, here's my receipt." This needs Stripe-grade trust: dense tables, unambiguous status colors, zero decoration, readable money data.

Neither a pure marketplace nor a pure console serves both. The hybrid assigns each principle to the area that needs it:

- **Everywhere:** Stripe/Linear restraint — flat surfaces, thin borders, small radii, single accent, no gradients/glass/decoration. (Already 90% true in the current tokens — keep.)
- **Catalogue:** marketplace patterns — real logos as the hero element, status-over-default badges, grid+list density toggle, filterable discovery. The logo IS the interface for recognition.
- **Dashboard/Billing/Subs:** Stripe-console patterns — compact stat rows, status-tagged tables, days-left progress bars, money in tabular numerals.
- **Access flow:** Linear-grade detail — the "Access" button's spinner→success sequence, subtle hover lifts, fast 120–150ms transitions, keyboard shortcut (⌘K) for power users.

## What this means concretely

**Keep (already correct):** dark-first neutral palette, indigo accent, Inter, 4px-grid spacing, 6–8px radii, thin borders, icon-only affordances, compact density, logo-first product tiles.

**Change:** consolidate dashboard alert→banner (B1), kill the "Not subscribed" noise badge (C2), add grid/list toggle (C1), live topbar search (A1), logo trust strip on landing (K1), a11y hardening (A7/A8).

**Reject outright:** gradients on surfaces, glassmorphism, floating decorations, charts/fake analytics, oversized hero type, rounded>8px cards, multi-hue palettes. The product sells ₹99 subscriptions to practical buyers — it should look like a *tool shop run by engineers*, not a design portfolio.

## Identity summary (one sentence)

> A dark-first, logo-led tool shop: Stripe's discipline for money and status, marketplace ergonomics for discovery, Linear's polish for interaction — nothing decorative anywhere.
