# REDESIGN_SUMMARY.md — Executive Summary

## Where we are

The mockup is **functionally complete and already well above typical AI-dashboard quality** — real logos, consistent tokens, all 12 pages, zero errors/overflow. What it lacks is **polish-layer decisions**: noise reduction, discovery ergonomics, and a11y hardening. This is a refinement pass, not a rebuild.

## The five decisions that matter most

1. **Direction: hybrid "SaaS-commerce"** — Stripe's restraint for money/status + marketplace ergonomics for the 87-tool catalogue + Linear's interaction polish. Not a pure clone of anything.

2. **Catalogue: kill noise + add density choice.** Remove the "Not subscribed" badge (it's the 80% default state = noise) and add a **grid/list view toggle** — the single biggest usability upgrade for browsing 87 items.

3. **Dashboard: one banner, not two alerts.** Consolidate expiry alerts into a single "N expiring — Review" strip that opens a renew-all modal. Replace the filler "Catalogue 87" stat with "Expiring ≤7d" and the duplicated renewal schedule with an upcoming-charges list.

4. **Search becomes real.** Topbar search currently teleports you; make it a live dropdown (⌘K) — the power-user path into 87 tools — and collapse it to a sheet on phones.

5. **A11y hardening now, not later.** Muted-text contrast fails AA in dark mode, modals lack focus traps, no skip-link, 34px touch targets. Small fixes, real users benefit.

## What NOT to do

- No redesign of the visual system — tokens are already right (dark-first, indigo accent, thin borders)
- No new pages/features for show — no analytics, reviews, gamification
- No React yet — polish the mockup, get approval, then port via `MOCKUP-TO-REACT-PROMPT.md`

## Deliverables produced

- `REDESIGN_AUDIT.md` — 40+ itemized findings w/ priority per page
- `DESIGN_DIRECTION.md` — hybrid rationale
- `DESIGN_SYSTEM_PROPOSAL.md` — final tokens incl. 5 marked changes
- `PAGE_REDESIGN_BLUEPRINT.md` — implementable per-page spec
- `FEATURE_ROADMAP.md` — 20 frontend + 8 backend-flagged features, prioritized
- `IMPLEMENTATION_PLAN.md` — 5-phase sequence, deployable after each

## Suggested next step

Approve **Phase 1** (a11y + expiry banner + catalogue density + cleanup) — it's the highest-value, lowest-risk batch. Each phase deploys independently for your review before the next begins.
