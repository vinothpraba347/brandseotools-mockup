# DESIGN_SYSTEM_PROPOSAL.md — Full Design System Specification

Builds on the existing `styles.css` tokens — most are already correct; this documents the *final* system with deltas flagged **[CHANGE]**.

## Color

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | `#fafbfc` | `#0c0d10` | App background |
| `--surface` | `#ffffff` | `#131418` | Cards, topbar, dropdowns |
| `--surface-2` | `#f4f5f7` | `#1a1b20` | Hover, inset, chips |
| `--surface-3` | `#eceef1` | `#22242a` | Avatar, pressed |
| `--border` | `#e4e6ea` | `#26282e` | Hairlines everywhere |
| `--border-strong` | `#d3d6db` | `#33363d` | Focus rings, inputs:hover |
| `--text` | `#16181d` | `#e8eaed` | Primary |
| `--text-2` | `#5c6370` | `#9aa1ad` | Secondary |
| `--text-3` | `#8b919c` | ~~`#636a76`~~ → **`#7a818e`** **[CHANGE]** | Muted (contrast fix — #636a76 ≈4.0:1 at 11px fails AA; #7a818e ≈4.7:1) |
| `--accent` | `#5b5bd6` | `#7c7cf0` | Single brand accent (indigo) |
| `--accent-text` | `#4f4fd0` | `#a5a5ff` | Accent text/links **[ensure pair contrast]** |
| `--accent-soft` | `#eeeeff` | `#22233d` | Selected chips, icon tiles |
| `--success/-soft` | `#1f9d55` / `#e5f6ec` | `#3dbf7a` / `#14261c` | Active, ok |
| `--warning/-soft` | `#b45309` / `#fdf1e0` | `#e8a848` / `#2a2114` | Expiring, pending |
| `--danger/-soft` | `#c33` / `#fbeaea` | `#f66` / `#2a1517` | Expired, errors |
| `--info/-soft` | `#2563eb` / `#e7effd` | `#6ea3f5` / `#151d2e` | Info notes |

**Status semantics (non-negotiable):** green=active/ok, amber=expiring/pending/attention, red=expired/failed, blue=informational. Never use accent for status.

## Typography

**Family:** Inter (400/500/600/700) → system fallback. Tabular numerals (`font-feature-settings:"tnum"`) on all money/date/stat values **[ADD — currently not set]**.

| Token | Size/Weight/Leading | Use |
|---|---|---|
| `--fs-display` | 26/600/1.2 | Page H1 ("Good evening, Rahul") |
| `--fs-h2` | 17/600 | Section/card titles |
| `--fs-h3` | 14/600 | Sub-headings, modal titles |
| `--fs-body` | 13.5/400/1.55 | Body |
| `--fs-sm` | 12.5 | Meta, badges, table secondary |
| `--fs-xs` | 11–11.5/500–600 | Labels, caps section titles (`letter-spacing:.06em uppercase`) |
| `--fs-stat` | 20/700 | Stat values |

**Caps labels** (MENU / YOUR TOOLS): 11px/600, `letter-spacing:.07em`, `text-3`.

## Spacing — 4px grid

`2 4 6 8 10 12 14 16 18 20 24 28 32` — card padding 16–18px; page pad 24–28px (16px ≤960px); section gaps 18–22px.

## Radius / Shadow / Borders

- `--r-sm:5px` buttons/inputs · `--r-md:8px` cards/menus · `--r-lg:10px` hero/panels · `99px` pills only
- Shadows: `--shadow-sm` 0 1px 2px rgba(0,0,0,.05); `--shadow-md` dropdowns 0 6px 20px; modals 0 12px 40px. **No shadows on cards** — borders carry elevation in this system.
- Border: `1px var(--border)` on every box. Never double borders (adjacent cards collapse via gap, not nested borders).

## Components

**Buttons** — h-32 (`btn-sm` h-28, `btn-lg` h-38), r-sm, fs-sm/600, `padding:0 12px`. Variants: `primary` (accent bg, white text), `secondary` (surface-2 bg + border), `ghost` (transparent, text-2, hover surface-2), `danger-outline`. Icon 15px inline. States: hover 6% darken, active translateY(0), `:focus-visible` 2px accent ring offset 1px, disabled 50% opacity.

**Inputs** — h-34, surface bg, border, r-sm, fs-sm, `padding:0 11px`; focus = accent border + 2px soft ring; error = danger border + xs danger helper below; label xs/600 above, 6px gap.

**Cards** — surface + 1px border + r-md; `card-pad` 16–18px; optional `card-hover` translateY(-1px) + border-strong on clickable cards only.

**Tables** — th 11px/600 caps text-3 on surface-2, `padding:9px 14px`; td 13px `padding:11px 14px`; rows separated by border-bottom; hover row surface-2; `white-space:nowrap` headers; responsive: horizontal-scroll container (not stacked) ≤960px, with sticky first column **[ADD]**.

**Badges** — `b-success|warning|danger|accent|neutral` — h-18, r-4, fs-xs/600, soft bg + status text; icons 11px. **Rule:** no badge for the default state ("Not subscribed" is removed) **[CHANGE C2]**.

**Chips/filters** — h-28, surface-2, border, r-5, fs-xs/500; `.on` = accent-soft + accent-text + accent border.

**Product icon (`.picon`)** — 34–36px tile: white bg + border + r-8 + logo `object-fit:contain` 22–26px; initials fallback category-colored. Same tile at 40–44px on detail hero.

**Alerts** — single-line strip, status-soft bg + 1px status border, icon + text + right-aligned action. Max one aggregated banner at a time **[CHANGE B1]**.

**Modals** — centered 400–520px, surface, r-md, shadow-md, `role=dialog`, backdrop `rgba(10,10,14,.5)`, Esc/backdrop/`[data-close]` dismiss + **focus trap + return focus** [ADD A7].

**Dropdowns** — `.menu` anchored right, min-w 210px; `.notif-menu` 330px desktop → fixed full-width sheet 12px margins ≤520px ✓(done).

**Toasts** — bottom-right (desktop) / bottom-center (mobile), dark tile, icon + text, auto-dismiss 3.5s.

**Progress (`.dbar`)** — 5px track surface-2, fill = status color by days-left.

**Sidebar** — 232px expanded / 64px rail; item h-34 r-6 icon 17px; active = accent-soft + accent-text; section labels caps; footer user card; collapse persisted; **toggle hidden ≤960px** [CHANGE A3].

**Topbar** — 56px sticky, surface, hairline bottom; search `min(340px,38%)` → icon-triggered sheet ≤520px [CHANGE A2].

## Icons

Lucide-style stroke icons only — `stroke-width:1.75`, 15–17px UI, 20px hero, `stroke-linecap:round`. Never emoji, never filled custom glyphs. Product images via `picon()` + `product-images.json` single source.

## Dark/Light

Dark is **default**; early `<head>` script prevents flash; `bst-theme` persists explicit choice; both palettes must pass AA for text-2 and above.

## Application rules

1. One accent color; status colors carry meaning only.
2. Borders not shadows for containment.
3. No badge/decoration for default states.
4. Density over whitespace — cards 16–18px padding, not 28px.
5. Every status element also has a non-color cue (icon or text) for colorblind users **[ADD]**.
