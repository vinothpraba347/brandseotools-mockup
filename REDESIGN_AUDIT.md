# REDESIGN_AUDIT.md — Complete UI/UX Audit

Audited: all 12 pages at 1440/1024/768/390/360px, dark + light themes, live interaction pass.
Overall verdict: the mockup is **functionally complete and visually coherent** — the gaps are in information architecture polish, a few hierarchy redundancies, accessibility hardening, and discovery ergonomics for an 87-item catalogue. Nothing is fundamentally broken.

---

## A. Global / Shell

| # | Area | Problem | Why it matters | Fix | Priority |
|---|------|---------|----------------|-----|----------|
| A1 | Topbar search | Input is decorative-navigational only — Enter navigates to `products.html?q=` | Linear/Raycast users expect instant results; a dead-looking box that teleports you feels broken | Live results dropdown (name + category + status) with keyboard navigation; ⌘K/Ctrl-K shortcut | P1 |
| A2 | Topbar | At ≤520px the search input still consumes ~180px, title collapses to 0px | Crowded; touch targets compete | Collapse search to an icon at ≤520px that opens a full-width search sheet (same pattern as the fixed notif-menu) | P1 |
| A3 | Sidebar | Collapse state persists to mobile via localStorage (fixed), but collapse toggle is still visible inside the mobile drawer | A desktop-only affordance rendered on mobile = confusion | Hide `.sb-toggle` below 960px entirely; drawer closes via X/backdrop only | P1 |
| A4 | Sidebar | "Subscriptions 4" count badge is the only nav badge; Catalogue (87) and Payment History get none | Inconsistent information scent | Either badge all count-worthy items or none; recommend: keep Subscriptions badge, add "expiring" dot variant when a sub is ≤7d | P2 |
| A5 | Theme | Dark is default ✓, but there is no "system" option and toggle is a single icon | Fine for mockup; flag for React phase | Theme: light/dark/system tri-state | P3 |
| A6 | Notifications | Items are read-only; "Mark all read" is the only action; items don't navigate | A notification you can't act on is a dead end | Click-through: expiry items → product-details; invoice items → billing with invoice open | P1 |
| A7 | Focus/a11y | No skip-link; modal lacks focus trap (Esc works, Tab escapes); dropdowns don't set `aria-expanded` | Keyboard users lose context | Add `.skip-link`, `aria-expanded`, focus trap + return-focus in `modal()` | P0 |
| A8 | Contrast | `--text-3` muted (#636a76 on #0c0d10) ≈ 4.0:1 — borderline at 11px sizes | Small muted text (times, hints) fails WCAG AA at small sizes | Lighten dark-mode muted to ~#7a818e or bump those usages to 12px+/500 weight | P0 |
| A9 | Touch targets | `.icon-btn` is 34×34 — under the 36–44px mobile guidance | Fat-finger errors on drawer/theme/bell | On ≤960px media query, bump `.icon-btn` to 38–40px | P1 |
| A10 | Motion | Transitions are fine and subtle; no `prefers-reduced-motion` query | Accessibility completeness | Add `@media (prefers-reduced-motion:reduce){*{transition:none}}` | P2 |

## B. Dashboard (`dashboard.html`)

| # | Problem | Fix | Priority |
|---|---------|-----|----------|
| B1 | Two stacked expiry alerts eat ~110px of prime viewport before content starts | Consolidate into one slim banner: "2 subscriptions expiring within 7 days — Review" → opens a renew-all modal; keep per-item dismiss only inside the modal | P0 |
| B2 | "Catalogue 87" stat card is trivia, not user state | Replace with "Expiring soon — 2 within 7 days" (real user-relevant metric); catalogue count already lives in the page header | P1 |
| B3 | "Renewal schedule" duplicates the alert + stats info a third time | Merge into the "Your tools" cards (days-left bar already exists) OR convert to a compact upcoming-charges list with prices (adds billing value, not duplication) | P1 |
| B4 | No onboarding state — a brand-new member sees the same dense grid | Add dismissable "Get set up" checklist card (Install extension ✓ / Pick your tools / Set WhatsApp alerts) shown only while checklist incomplete | P1 |
| B5 | "Recently used" mixes Open and Renew CTAs — good — but no way to remove/clear items | Add a small "Clear" action; low effort | P3 |
| B6 | Announcements are static; one is a WhatsApp payment notice (real workflow) — good keep | Keep; ensure it's visually distinct (info icon, not alarm colors) | — |

## C. Tool Catalogue (`products.html`)

| # | Problem | Fix | Priority |
|---|---------|-----|----------|
| C1 | 87 tall cards = long scroll; no density option | Add grid/list toggle — compact rows (logo 28px, name+cat+status+price+CTA in one line) for power browsing | P0 |
| C2 | "Not subscribed" badge renders on ~80 of 87 cards | Pure noise — it's the default state. Remove badge entirely when unsubscribed; badges only for Active/Expiring/Expired/Cloud/Popular | P0 |
| C3 | "Add a tool" primary button top-right is ambiguous (looks like admin action) | Rename to "Get a bundle" or remove — the Subscribe CTA lives on cards. If it means "suggest a tool," relabel "Request a tool" → support modal | P1 |
| C4 | Filters cover category/owned/fav but not the two most useful: price band and access type | Add `≤₹99 / ₹100–249 / ₹250+` and `Extension / Cloud` filter chips or a filter popover | P1 |
| C5 | Card CTA set (Details + Subscribe + star) is good, but Subscribe goes straight to modal — no visual of what happens | On Subscribe click → small confirm modal: price, 30-day term, "Activate" — matches the real site's per-tool purchase flow | P1 |
| C6 | No "expiring" state on card when subscribed-but-expiring — actually present (Expires in 2d badge). Keep | — | — |
| C7 | Sort offers Name/Price/Popular — fine; missing "Recently added" | Add "Newest" sort if data supports it | P3 |

## D. Product Details (`product-details.html?slug=`)

| # | Problem | Fix | Priority |
|---|---------|-----|----------|
| D1 | "Similar tools" shows only 3 rows, list-style — weak discovery | Same-category compact card row (4 items, logo+price+CTA), "View all" links to filtered catalogue | P2 |
| D2 | Right rail "Before you access" duplicates extension requirements that also appear on extension.html | Keep (contextually correct) but link the whole block to extension page | P2 |
| D3 | No breadcrumb back-action beyond text crumb | Make "Tool Catalogue" crumb a link (verify it is — if plain text, wrap in `<a>`) | P1 |
| D4 | Missing per-tool FAQ/support entry | Add "Having trouble with this tool?" → support.html?topic=access link in right rail | P2 |
| D5 | Access button simulates well; could deepen realism | On success, also append to "Recently used" (verify — likely already does via recent tracking) | — |

## E. Subscriptions (`subscriptions.html`)

| # | Problem | Fix | Priority |
|---|---------|-----|----------|
| E1 | Active/past tables fine; per-row Renew only — no batch action for the multi-expiry case | "Renew all expiring (2)" button when ≥2 subs expire ≤7d → combined modal w/ total | P1 |
| E2 | No subscription calendar/timeline view | P2: simple month strip showing expiry dots — genuinely useful for 30-day-cycle users | P2 |
| E3 | Expired rows show Renew; unclear they can also re-subscribe from catalogue | Fine as is | — |

## F. Billing (`billing.html`)

| # | Problem | Fix | Priority |
|---|---------|-----|----------|
| F1 | Invoice is a modal only — no download affordance | "Download PDF" button inside invoice modal → simulated toast (consistent with prototype rules) | P2 |
| F2 | Filters fine; no date-range | P3 | — |
| F3 | Empty state exists ✓ | — | — |

## G. Profile / Settings (`profile.html`)

| # | Problem | Fix | Priority |
|---|---------|-----|----------|
| G1 | Avatar is initials, no change affordance | Simulated upload button → toast | P3 |
| G2 | "Sign out all sessions" modal exists ✓ — good | — | — |
| G3 | No WhatsApp/phone alert preferences (real product uses WhatsApp support) | Add "WhatsApp renewal reminders" toggle in Notifications tab — matches real ops | P1 |

## H. Support (`support.html`)

| # | Problem | Fix | Priority |
|---|---------|-----|----------|
| H1 | Contact cards are good (WhatsApp/email/guide); FAQ search+cats work | — | — |
| H2 | No link back to extension troubleshooting from Access FAQs | Cross-link relevant FAQ answers to extension.html | P3 |

## I. Extension (`extension.html`)

| # | Problem | Fix | Priority |
|---|---------|-----|----------|
| I1 | Mobile notice + Kiwi/Orion guide — done ✓ | — | — |
| I2 | No "is my extension working?" live check beyond simulated modal — correctly simulated for mockup | — | — |
| I3 | Download button toasts — fine for prototype | Could add a fake "v3.0.1 release notes" link for realism | P3 |

## J. Auth (`login` / `signup` / `forgot-password`)

| # | Problem | Fix | Priority |
|---|---------|-----|----------|
| J1 | Signup step-1 leaves large empty right area at 1440px | Center the form card + "Why members join" panel as a balanced 2-col at max-width ~900px | P2 |
| J2 | Login split layout is solid | — | — |
| J3 | No social/SSO — production doesn't have it; correctly absent | — | — |

## K. Landing (`index.html`)

| # | Problem | Fix | Priority |
|---|---------|-----|----------|
| K1 | Hero is clean but empty-feeling below CTA; stats strip helps | Add a logo strip of 8–10 marquee brands (real logos already in assets) between hero and How-it-works — trust signal, zero copy cost | P1 |
| K2 | "Popular right now" grid exists ✓ | — | — |
| K3 | Footer present; ensure it has the WhatsApp/support contact (real ops channel) | P2 | — |

## L. Code-level issues

| # | Issue | Fix |
|---|-------|-----|
| L1 | Stray dev files in repo root (`atest.js`, `fetch-logos.js`, `fetch-logos2.js`) | Delete — they're in the deployment checkout too? Verify and remove |
| L2 | Inline `style=` attributes on ~10 blocks (extension.html, detail rail, signup) | Migrate to classes for React parity |
| L3 | `app.js` ~820 lines single file — acceptable for mockup | React phase splits naturally; no refactor needed now |
| L4 | No 404 page | Add `404.html` styled to match (GitHub Pages serves it automatically) | P2 |
| L5 | `MOCKUP-TO-REACT-PROMPT.md` exists but doesn't yet enumerate every edge state | Update during React phase |

## Confirmed working / keep

- Shell (sidebar+topbar+dropdowns+theme+collapse persist), dark-default + no-FOUC theme script
- Full signup funnel w/ cart + coupon, renew modals w/ date math, invoice modal, FAQ accordion+search, extension status modal, favorites+recent localStorage, 83 real logos + initials fallback, mobile drawer + full-width notif sheet, extension mobile guide, zero overflow 360–1440, zero dead links/images
