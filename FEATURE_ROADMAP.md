# FEATURE_ROADMAP.md — Feature Recommendations & Priorities

Rule applied: every feature must serve the platform's two jobs — **discover tools** and **manage access**. Frontend-feasible = shippable in the mockup; Backend-dependent = flagged for real app.

## Frontend-feasible (mockup can ship)

| Feature | What / why needed | Look & behavior | Complexity | Release |
|---|---|---|---|---|
| **Live topbar search** (A1) | Input currently navigates away; users expect instant results — 87 tools needs a fast path | ⌘K/Ctrl-K + click opens dropdown: up to 8 rows (logo, name, cat, status, price), arrow-key nav, Enter → details | Med | R1 |
| **Grid/list catalogue toggle** (C1) | 87 tall cards = heavy scrolling; list suits "I know what I want" | Icon toggle in toolbar, persisted; list rows ~56px, same CTAs | Med | R1 |
| **Consolidated expiry banner + renew-all** (B1/E1) | 2 stacked alerts waste prime space; multi-expiry is the common case | One amber strip "N expiring in 7d — Review" → modal listing each sub w/ renew checkboxes + total | Med | R1 |
| **Clickable notifications** (A6) | Dead-end info; expiry notif should open the tool | Item click → product-details/billing; keep mark-all-read | Low | R1 |
| **Price/access filters** (C4) | Category isn't how buyers think — budget and install-ability are | Filter popover: 3 price bands + Extension/Cloud; combine w/ chips | Low | R1 |
| **Subscribe confirm modal** (C5) | One-click subscribe with no confirmation feels fake | Modal: logo/name/price/30-day/Activate → toast + state flip | Low | R1 |
| **Onboarding checklist** (B4) | New member's first job is install+pick — dashboard should guide | Dismissable checklist card until done; `bst-setup` flag | Low | R1 |
| **A11y hardening** (A7/A8/A9) | Focus trap, skip link, muted-contrast bump, 38px touch targets | Invisible to sighted users | Low | R1 |
| **Search→mobile sheet** (A2) | 180px input crowds phone topbar | ≤520px: icon → fixed sheet with input + results | Low | R1 |
| **404 page** (L4) | Dead URLs hit server default | Branded center page | Low | R1 |
| **WhatsApp reminder toggle** (G3) | Real ops channel is WhatsApp; surface it in prefs | Switch in Notifications settings | Low | R1 |
| **Logo trust strip** (K1) | Landing hero→content gap; free trust signal | 8–10 brand logos row, muted→hover | Low | R1 |
| **Recently-used "Clear"** (B5) | Privacy/declutter | Small link in card head | Low | R2 |
| **Subscription calendar strip** (E2) | 30-day-cycle users think in dates | Month row above subs table, dots on expiry days, hover=tool | Med | R2 |
| **Newest sort** (C7) | "What's new" is a real discovery mode | Sort option | Low | R2 |
| **Product compare** | Users compare Canva vs Crello etc. | Select 2–3 → side-by-side price/cat/access table | Med | R2 |
| **Invoice download** (F1) | Expectation of a billing page | "Download PDF" → simulated toast | Low | R2 |
| **Per-tool help link** (D4) | Context support | Right-rail link → filtered FAQ | Low | R2 |
| **Keyboard shortcuts** | Power polish: ⌘K search, g-d/g-p nav, ? cheat sheet | Shortcut map modal | Med | R3 |
| **PWA shell** | "App-like" feel, re-engage | manifest + icons + basic SW cache; installable | Med | R3 |
| **Theme: system option** | Respects OS preference | Tri-state toggle | Low | R3 |
| **Avatar upload** (G1) | Profile completeness | Simulated picker | Low | R3 |
| **Renewal reminder prefs granularity** | Per-tool reminder on/off | Per-sub toggle in subs table | Low | R3 |

## Backend-dependent (document for the real app — NOT in mockup)

| Feature | Why |
|---|---|
| Real notification feed (push/email/WhatsApp on expiry) | Core retention lever — mock data only here |
| Usage history / "last accessed" server-side | Needs session tracking |
| Payment gateway + auto-renew mandate | Real billing; current flows stay simulated |
| Session management / device list | Security feature needs real sessions |
| 2FA | Same |
| Extension live-status detection | Real `chrome.runtime` handshake — mockup toasts it |
| Referral/affiliate credit | Common in this market; needs backend ledger |
| Support ticketing | WhatsApp links suffice for mockup |

## Explicitly NOT recommended

- Reviews/ratings (social proof theater for a group-buy tool — invites fraud questions)
- Charts/analytics widgets (nothing real to chart)
- Wishlist beyond favorites (favorites already cover it)
- Community/blog/changelog pages (scope creep)
- Dark-marketplace "deals" gamification (discount badges, countdown timers — hurts the professional tone)
