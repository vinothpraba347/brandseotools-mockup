# PAGE_REDESIGN_BLUEPRINT.md — Page-by-Page Proposed Layouts

Spec-level. Reference IDs match `REDESIGN_AUDIT.md` findings.

## Shell (all app pages)

| Current | Proposed |
|---|---|
| Sidebar 232px/64px rail, toggle inside drawer on mobile | Same; `.sb-toggle` display:none ≤960px (A3); drawer has backdrop-close only |
| Topbar: menu / title / search / theme / bell / avatar | Same; add live-results dropdown on search (A1); search→icon at ≤520px opening fixed sheet (A2) |
| Notif menu | Keep new fixed-sheet mobile style; items become clickable → target page (A6) |
| — | Add `.skip-link` to `#main`; `aria-expanded` on all menu triggers; modal focus trap (A7) |

## `index.html` — Landing

| Current problems | Proposed layout | New components | Priority |
|---|---|---|---|
| K1 gap between hero CTA and How-it-works | Nav → hero (kicker, H1, lede, CTA pair) → **logo trust strip** (8–10 real brand logos, muted 60% opacity, full color on hover) → How-it-works 3 cards → Popular-right-now grid (12, logos + price + Subscribe→signup) → stats strip → footer (support/WhatsApp) | `.logo-strip` (flex, `filter:grayscale(1) opacity(.6)`, hover full) | P1 |

## `login.html` / `forgot-password.html` — solid as-is
No changes. Keep split layout: brand panel left (hidden ≤960px), form right.

## `signup.html` — 3-step funnel

| Problems | Proposed |
|---|---|
| J1 empty right at step 1 | Wrap all steps in `max-width:960px` centered; step-1 = form card (left 1fr) + "Why members join" (right 320px) |
| Step 2 picker dense ✓ | Keep searchable pick-grid + sticky cart sidebar; add per-item "30 days" sub-label |
| Step 3 | Keep; ensure order lines use tabular numerals; coupon success shows green line-item −10% |
| Success view ✓ | Keep CTAs: Install extension (primary) / Go to dashboard |

## `dashboard.html`

| Problems | Proposed layout | New components | Priority |
|---|---|---|---|
| B1 stacked alerts | **Single banner**: "⚠ 2 subscriptions expire within 7 days" + `Review` btn → renew-all modal (per-item list, per-item renew or select-all, total ₹) | `.alert-strip` + `.renew-all-modal` | P0 |
| B2 Catalogue stat filler | Stats row: Active subs / Expiring ≤7d (amber when >0) / Monthly spend / Next expiry | — | P1 |
| B3 renewal-schedule duplicates | Replace bottom-left card with **"Upcoming charges"** — rows: logo, tool, date, amount → totals row. Same footprint, billing-relevant | `.charge-list` | P1 |
| B4 no onboarding | Dismissable "Get set up" checklist card above Your-tools when `bst-setup` incomplete: Install extension / Favorite a tool / Enable WhatsApp reminders (links to profile) | `.setup-card` + `bst-setup` localStorage | P1 |
| B5 recent list | Keep + tiny "Clear" | — | P3 |

## `products.html` — **highest-impact page**

| Problems | Proposed layout | New components | Priority |
|---|---|---|---|
| C1 only tall grid | Toolbar gains **grid/list toggle** (icon pair, persisted `bst-view`). List row: picon-28 / name+cat / status badge / access-type icon / price / Details+Subscribe — one line, ~56px rows | `.prod-row`, `.view-toggle` | P0 |
| C2 badge noise | Remove "Not subscribed" badge; keep Active/Expiring-in/Expired/Cloud/Popular | — | P0 |
| C3 "Add a tool" | Remove from header (or relabel "Request a tool" → support modal) | — | P1 |
| C4 missing filters | Filter popover (Filter icon btn): price bands (≤99/100–249/250+), access type (Extension/Cloud) — combine with existing chips | `.filter-pop` | P1 |
| C5 subscribe flow | Subscribe → confirm modal: logo, name, ₹price, "30 days — manual renewal", Activate btn → success toast + card flips to Active | reuse `.modal` | P1 |
| Search | Keep; empty state exists; add "No tools — clear filters" action | — | — |

## `product-details.html`

| Problems | Proposed | Priority |
|---|---|---|
| D1 weak similar | Similar tools → 4 compact cards (logo/name/price/Subscribe), "View all" → catalogue filtered to same cat | P2 |
| D3 crumb | Ensure "Tool Catalogue" crumb is `<a>` back to products.html | P1 |
| D4 support link | Right rail footer: "Having trouble? → Get help" → support.html | P2 |
| Structure | Keep: hero (logo-44/name/cat/price/★/status) / About / Access-steps / note / right rail (status card + requirements) | — |

## `subscriptions.html`

| Problems | Proposed | Priority |
|---|---|---|
| E1 no batch renew | When ≥2 subs ≤7d: amber strip atop table "Renew all expiring — ₹total" → shared modal | P1 |
| E2 calendar | P2: month strip header on Active table showing expiry dots per day | P2 |
| — | Table gets horizontal scroll + sticky col ≤960px | P1 |

## `billing.html`
Keep search/status filter/table/invoice modal. Add "Download PDF" btn in invoice modal → toast (P2). Sticky-col scroll on mobile.

## `profile.html`
Keep tabs. Add "WhatsApp renewal reminders" toggle in Notifications tab (G3, P1). Avatar "Change" → simulated (P3).

## `support.html`
Keep contact cards + FAQ search/cats/accordion + form. Cross-link Access FAQs → extension.html (P3).

## `extension.html`
Keep hero/steps/req/troubleshooting + mobile desktop-required+Kiwi/Orion note ✓. Optional: "Release notes v3.0.1" fake link (P3).

## `404.html` — **[NEW]**
Centered: logo, "404 — page not found", 2 CTAs (Dashboard / Catalogue). GitHub Pages serves it automatically (L4, P2).

## Responsive matrix

| Breakpoint | Behavior |
|---|---|
| 1440 | Sidebar 232, content max-1200, 4-col prod grid, full topbar |
| 1280 | Same, prod grid ~4→3 |
| 1024 | Sidebar stays (or auto-rail option), prod grid 3 |
| 768 | Sidebar→drawer; prod grid 2; tables scroll-x sticky-col; stat rows 2×2 |
| 520 | Topbar search→icon sheet; notif/user menus fixed sheets; land-nav hides ghost |
| 390/360 | Prod grid 1; single-column all; icon-btns 38px; steps/stacked layouts |
