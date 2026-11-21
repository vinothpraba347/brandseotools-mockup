# Build Prompt — Recreate the BrandSeoTools Mockup in React/Next.js

> **Purpose of this file:** feed this prompt to an agent (or use it yourself) to rebuild the
> approved static mockup at `mockup/` as a real React application — **pixel-faithful**.
> The static HTML/CSS/JS version is the source of truth for every visual and interaction decision.
> Do not redesign. Do not "improve". Port it.

---

## 1. Project context

BrandSeoTools is a membership platform selling 30-day shared subscriptions to ~87 premium tools
(Semrush, ChatGPT, Canva, Udemy, Envato, …) at ₹99–₹849/month. Members install a Chrome extension
that signs them into shared tool workspaces. The approved redesign lives at `./mockup/` as
static files — open `mockup/index.html` and click through everything before writing code.

**This phase = React port of the approved design, still with dummy data. No backend.**

## 2. Tech stack

- **Next.js (App Router) + React + TypeScript**
- **Tailwind CSS** — map the CSS custom properties below into `@theme` tokens
- **lucide-react** for all icons (16px default, 20px emphasis, strokeWidth 1.75)
- No component library needed — the design is simple primitives. No charts, no animation libs.
- Mock data in `src/data/*.ts` mirroring `mockup/assets/js/mock-data.js` exactly.

Suggested structure:
```
src/
  app/(public)/page.tsx, login/, signup/, forgot-password/
  app/(member)/layout.tsx          ← sidebar + topbar shell
  app/(member)/dashboard/, catalogue/, catalogue/[slug]/,
    subscriptions/, billing/, settings/, support/, extension/
  components/{layout,ui,catalogue,dashboard,forms}
  data/{products,user,subscriptions,transactions,notifications,faqs}.ts
  lib/{format,dates,store}.ts
```

## 3. Design tokens (exact)

Port these CSS variables verbatim into the theme. Both palettes exist — dark is class-based.

```css
:root{
  --bg:#fafbfc; --surface:#fff; --surface-2:#f4f5f7; --surface-3:#eceef1;
  --border:#e4e6ea; --border-strong:#d2d5da;
  --text:#16181d; --text-2:#5c6370; --text-3:#8b919c;
  --accent:#5b5bd6; --accent-hover:#4f4fc8; --accent-soft:#eeeeff; --accent-text:#4747c2;
  --success:#15803d; --success-soft:#e6f4ea;
  --warning:#b45309; --warning-soft:#fdf3e4;
  --danger:#b91c1c;  --danger-soft:#fbeaea;
  --info:#0369a1;    --info-soft:#e8f4fb;
  --ring:rgba(91,91,214,.45);
}
.dark{
  --bg:#0c0d10; --surface:#131418; --surface-2:#1a1b20; --surface-3:#22242b;
  --border:#26282e; --border-strong:#33363e;
  --text:#e8eaed; --text-2:#9aa1ad; --text-3:#636a76;
  --accent:#7c7cf0; --accent-hover:#8f8ff4; --accent-soft:#22233d; --accent-text:#a5a5f5;
  --success:#4ade80; --success-soft:#12291a;
  --warning:#fbbf24; --warning-soft:#2c2210;
  --danger:#f87171;  --danger-soft:#2e1515;
  --info:#7dd3fc;    --info-soft:#0e2434;
}
```

- **Font:** Inter (`next/font/google`), system fallback; `font-feature-settings:"cv11","tnum"`.
- **Type scale:** 12 caption · 13 small · 14 body · 15 emphasis · 20 card-title · 21–24 page-title · 36 landing-hero. Weights 400/500/600. Heading tracking −0.011em. Numbers tabular.
- **Spacing:** 4px scale — 8/12/16/20/24/28/32/48. Content max-width 1240px, padding 24–28px (16px mobile).
- **Radius:** 6 controls, 8 cards, 10 modals. Pills only for chips/badges.
- **Shadows:** almost none — `0 1px 2px rgb(0 0 0/.04)` cards; `0 8px 24px rgb(0 0 0/.12)` dropdowns/modals. **Borders do the grouping, not shadows.**
- **Category hues (product-icon tiles):** SEO `#6366f1`, AI & Writing `#0e9f6e`, Design & Media `#d97706`, Learning `#0e7490`, Streaming `#c026d3`, Utilities `#64748b`, Bundles `#5b5bd6`.

## 4. Component spec (build these, in this order)

| Component | Spec |
|---|---|
| `ProductIcon` | Rounded tile (34px, r-8; 46px on detail header; 30px in pick grid; 26px in tables). If the product has a mapped logo in `product-images` (`mockup/assets/data/product-images.json`, files under `assets/images/products/`), render the image `object-fit:contain` padded on a **white** tile (always white — brand logos need a light surface even in dark mode) over the initials; on image error, remove it so the **category-colored initials tile** shows as fallback. Products without a mapping show initials only. Never generic lucide icons. Port the image assets + mapping JSON to `public/`. |
| `Badge` | 11px/600, r-5, soft-bg+colored-text. Variants: `active`(green) `expiring`(amber) `expired`(red) `neutral`(gray) `info`(blue) `accent`. |
| `Button` | h-34px, px-13, r-6, 13px/500. `primary` (accent fill), `secondary` (surface+border-strong), `ghost`, `danger-outline`; `sm` h-28, `lg` h-40. Focus ring `0 0 0 3px var(--ring)`. |
| `Input`/`Select`/`Textarea` | h-36, r-6, border-strong, label 13px/500 above, `.err` 12px danger below on `.invalid`, focus ring accent. |
| `Card` | surface + 1px border + r-8 + shadow-sm; optional `card-head` (13px bottom-border row). |
| `Chip` | h-28, r-999, border, 12.5px/500, optional count; `.on` = accent-soft bg + accent text. |
| `Table` | thead: surface-2, 11px uppercase text-3; rows border-b, hover surface-2; numbers right-aligned tabular. Wrap in `.tbl-wrap` (border+r-8) with horizontal scroll <640px. |
| `DaysLeftBar` | 5px rounded track; fill % = daysLeft/term; green → amber ≤7d → red ≤4d; label `Nd left` / `Nd ago`. |
| `Switch` | 34×19 iOS-style, accent when on. |
| `Tabs` | bottom-border strip, active = accent text + 2px accent underline. |
| `Modal` | overlay rgba(10,10,14,.45), panel surface r-10 max-w-460, header/title 16/600 + X, footer surface-2 with right-aligned buttons; Esc + overlay dismiss, focus to first control; bottom-sheet on <640px. |
| `Toast` | bottom-right stack, surface+border+shadow-md, 16px status icon (green/amber/red/blue), auto-dismiss ~3.6s, slide-out exit. |
| `Dropdown/Menu` | surface+border r-8 py-5px shadow-md, item h-33px hover surface-2, sep lines, optional head label; open on click (not hover), close on outside/Esc. |
| `Alert` | soft-bg banner (warn amber / info blue), 17px icon, inline action button, dismiss X. |
| `Steps` | numbered circles (accent-soft) connected by 1px vertical line. |
| `Empty` | centered: 40px surface-2 icon tile, 14.5px title, 13px desc, optional CTA. |
| `Stat` | card: 12px text-3 label, 20px/600 tabular value (+small unit), 12px sub. |
| `FAQItem` | accordion — question row 13.5px/600 + chevron rotates 180°, answer 13px text-2, category micro-label above question. |

## 5. App shell (all member pages)

- **Layout:** CSS grid `sidebar 232px | main`. Sidebar sticky 100vh; topbar 56px sticky.
- **Sidebar:** brand row (26px accent tile "B" + "BrandSeoTools / MEMBER AREA" + collapse chevron), nav grouped `MENU` (Dashboard, Tool Catalogue, Subscriptions — with live-count badge, Payment History), `HELP` (Install Extension, Help & Support), `ACCOUNT` (Settings). Item: h-34, r-6, icon 17px text-3, 13.5px/500 text-2; active = accent-soft bg + accent 600 text; hover surface-2. Footer: user card (avatar initials + name + email). Collapse → 60px rail, icon-only, **persisted** (`bst-sidebar` in localStorage).
- **Topbar:** hamburger (mobile only), page title, right: global search input (Enter → `/catalogue?q=`), theme toggle (persist `bst-theme`, swaps sun/moon), notifications bell (unread dot), avatar → dropdown.
- **Notifications dropdown:** 330px menu — "Mark all read", 5 items (icon-less: colored dot + bold title + body + relative time), "View announcements" footer. Reading an item clears its dot.
- **User dropdown:** email head, Settings, Payment history, sep, Sign out (danger → toast → `login`).

## 6. Pages — port these exactly

### Public
1. **`/` landing** — top nav (logo, Support, Sign in, Get started), centered hero: accent kicker pill "87 tools · one membership", 36px h1, lede, 2 CTAs; bottom strip: 87 tools / ₹99 starting / 30 days / 1-click.
2. **`/login`** — split screen: left brand panel (logo, 26px h1, lede, 3 check-icon selling points) + right 460px column: card heading, bordered form (email, password w/ eye toggle, remember-me + forgot link, primary block), footer link, blue demo-note. Validation: email regex, pw ≥6 → inline errors + red top alert; success → 900ms "Signing in…" → `/dashboard`.
3. **`/forgot-password`** — same shell; email → "Check your inbox" state with resend button.
4. **`/signup`** — top bar (logo + "Already a member? Sign in") + 3-step progress:
   - **Step 1 Account:** name, email, password ≥8, WhatsApp phone ≥10, terms checkbox — all validated.
   - **Step 2 Choose tools:** search + 7 category chips + pick grid (icon tile, name, category, price `/30d`); toggle `.sel` = accent border + soft bg. Right sticky **order summary**: item rows w/ remove, subtotal, coupon row (code `SAVE10` → −10%, invalid → red msg), "Due today", disabled CTA until ≥1 item. `?add=<slug>` pre-selects.
   - **Step 3 Review & pay:** payment radios (UPI/Card/PayPal), order lines, pay button → 1.4s "Processing…" → success view (green check tile, Install extension / Go to dashboard CTAs).

### Member (`(member)` layout)
5. **`/dashboard`** — greeting + date sub, CTA pair (Install extension / Browse tools); **expiry alert per sub ≤7d** (dismissable, Renew-now → renew modal); 4 stats (active count, next expiry, monthly spend, catalogue size); left col: "Your tools" card-grid (icon, name→detail link, cat, status badge, days bar, price, Access btn), "Renewal schedule" rows; right col: "Recently used" (localStorage `bst-recent`, Open/Renew btn), "Announcements" (megaphone icon rows).
6. **`/catalogue`** — title + count sub + "Add a tool" CTA; toolbar (search, sort select: A–Z/popular/price asc/desc, quick filters All/My tools/Favorites); category chips w/ counts; grid `repeat(auto-fill,minmax(258px,1fr))` of product cards — icon, name, cat + "Popular" tag, star favorite (persist `bst-favs`, amber filled), 2-line clamp desc, status badge (+ `Cloud` badge for cloud-access tools), price, CTA pair (Access if owned | Details+Subscribe). `?q=` deep-link. Empty state w/ clear-filters.
7. **`/catalogue/[slug]`** — breadcrumb, head row (46px icon, name, meta line, star, status badge); 2-col: left = About card (desc + "How access works" 3 steps + blue note about single-seat) + Similar tools card (3 same-cat rows); right = **access panel** — owned: status badge + expiry date + days bar + big `Access X` btn (1.1s "Preparing…" → "Signed in — redirecting…" toast → reset) + `Renew — ₹N` btn + version note; not-owned: price/billing/access-method kvs + `Subscribe` → `/signup?add=slug`. Below: "Before you access" requirements card.
8. **`/subscriptions`** — sub text "fixed 30-day terms — renew manually"; 4 stats; **active table** (tool,status,started,expires,days-bar,price,Access+Renew) sorted by expiry, **past table** (Expired rows, Renew only).
9. **`/billing`** — toolbar (search, status select); txns table (invoice id,date,item,method,amount,status badge, Invoice btn) → invoice modal (billed-to rows + Download PDF → simulated toast); empty state.
10. **`/settings`** — tabs Profile/Security/Notifications: profile form (name,email,phone,timezone; username disabled; validation+toast); security = change-pw form (cur/new≥8/match) + sessions card (Sign-out-others → confirm modal, 2FA "Coming soon" badge, current device); notifications = 4 switch rows → toast.
11. **`/support`** — 3 contact cards (WhatsApp→toast, Email copy→toast, Extension guide link); left: FAQ search + cat chips + 12-question accordion; right: contact form (topic select + msg ≥10 → success toast, reset).
12. **`/extension`** — hero card (56px accent icon tile, name + `v3.0.1` badge, desc, Download→toast, "Check extension status"→900ms spinner→"not detected" modal w/ install CTA); 2-col: 4-step install guide + blue cloud-access note; requirements checklist; troubleshooting list.

## 7. Data model (`src/data/`)

Mirror `mockup/assets/js/mock-data.js` exactly:

```ts
User { name, firstName, email, username, joined, plan }
Product { slug, name, cat, price, popular?, dest, access: 'extension'|'cloud', desc }
Subscription { id, product:slug, started, expires, status, autoRenew, amount }
Transaction { id, date, item, method, amount, status:'completed'|'failed'|'refunded' }
Notification { id, type:'expiry'|'announcement'|'payment'|'system', title, body, time, read }
Announcement { id, title, body, link? }
Faq { cat:'Access'|'Billing'|'Account'|'Extension', q, a }
```

- 87 products across 7 categories: SEO & Marketing(26), AI & Writing(24), Design & Media(24), Learning(8), Streaming(2), Utilities(1), Bundles(2). Prices ₹99/179/249/349/425/849. `popular` on ~12 items.
- Demo user: **Rahul Sharma / rahul.sharma@example.com / rahulsharma**.
- 7 subscriptions: Udemy active→21 Dec, Semrush→28 Nov, Canva→25 Nov, CapCut→10 Dec (live); ChatGPT, Netflix, Grammarly (expired).
- 8 transactions INV-2201…2419 incl. one `failed`, one `refunded`; 5 notifications; 2 announcements; 12 FAQs.
- **Fixed "today" = 2026-11-23** for deterministic days-left math (same as mockup).

## 8. Interaction & state rules

- localStorage keys: `bst-theme`, `bst-sidebar`, `bst-favs`, `bst-cart`, `bst-recent`. Replicate all.
- Favorites star: click toggles, amber when on, toast confirm; reflected instantly in filters.
- Renew flow is a **modal** (product head, price, current→new expiry +30d, disclaimer "simulated") → pay → toast.
- All backend-touching actions simulate: loading spinner 0.9–1.4s → success toast or state change. Nothing real.
- `?slug=`, `?q=`, `?add=` URL params drive page state; keep them (`useSearchParams`).
- Every button does something — no dead UI. Empty, loading, error states exist everywhere they're used now.

## 9. Responsive (verified behavior — preserve)

| Width | Behavior |
|---|---|
| ≥1440 | as designed — polish target |
| ≤1180 | stats 4→2 cols, `grid-23`/signup→1 col, summary unstick |
| ≤960 | sidebar → off-canvas drawer + backdrop + hamburger; title hidden, search shrinks; auth loses brand panel |
| ≤640 | product grid 1-col; tables h-scroll; modal→bottom sheet; toasts full-width; landing hero 27px |

No horizontal overflow at 390px and 360px — this was tested.

## 10. Accessibility / quality bar (match the mockup)

`lang="en"`, semantic landmarks, real `<label>`s, `aria-pressed` on toggles/favorites, `aria-expanded` on accordion, `aria-label` on icon buttons, `:focus-visible` ring, Esc closes menus/modals, `prefers-reduced-motion` disables transitions. Zero console errors; all 12 pages currently pass an 80-assertion interaction suite — the React version must pass the same.

## 11. Anti-rules (what NOT to do)

- No gradients, glassmorphism, floating shapes, glows, fake charts/analytics, oversized type, or generic-dashboard filler.
- Product icons = local brand assets from `product-images.json` with colored-initial tiles as fallback for unmapped/broken images (All in One, Basic Plan, Fotoget, Fiesta are intentionally initials-only).
- No real payments, auth, extension calls, or backend — all simulated, all labeled as simulated where the mockup labels them.
- Do not invent products, prices, pages, or features — port exactly what's there.
- Do not add comments/docs beyond what's needed; keep components small and flat.

## 12. Definition of done

Route-for-route and pixel-for-pixel parity with `mockup/` at 1440/1280/1024/768/390/360;
every interaction in §8 works; identical data renders identical states
(e.g. Canva = "Expires in 2d" amber badge, 2d-left bar, renew modal shows new expiry 25 Dec).
Side-by-side screenshot diff of each page vs the static mockup ≈ identical.
