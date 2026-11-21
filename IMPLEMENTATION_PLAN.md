# IMPLEMENTATION_PLAN.md — Recommended Sequence

Static mockup only. Each phase is independently deployable; verify after each at 1440/390 + push to Pages.

## Phase 1 — Foundations (P0, ~half the user-visible gain)

1. **A7+A8 a11y**: `.skip-link`, modal focus trap + return-focus, `aria-expanded` on menu triggers, `--text-3` dark bump to `#7a818e`, non-color cues on statuses
2. **B1 expiry banner**: single `.alert-strip` w/ count → renew-all modal (reuses existing `renewModal` logic, add multi-select)
3. **C1+C2 catalogue**: remove "Not subscribed" badge globally; add `.prod-row` list view + `bst-view` toggle
4. **A3 sidebar**: hide `.sb-toggle` ≤960px (it's dead weight in drawer)
5. Cleanup: delete `atest.js`, `fetch-logos*.js` from both worktree AND deployment repo; add `404.html`

*Checkpoint: dashboard top is ~60px taller usable space; catalogue list view live.*

## Phase 2 — Discovery (P1)

6. **A1 search**: dropdown results in topbar w/ keyboard nav (shared `searchProducts()` helper reused by catalogue)
7. **A2 mobile search sheet** ≤520px (same dropdown, fixed-position variant)
8. **C4 filter popover**: price bands + access type
9. **C5 subscribe confirm modal** on card CTA
10. **A6 clickable notifications** → deep links
11. **B2/B3 dashboard stats**: swap "Catalogue"→"Expiring ≤7d"; renewal-schedule→upcoming-charges list
12. **K1 logo trust strip** on landing

## Phase 3 — Depth (P1/P2)

13. **B4 onboarding checklist** (`bst-setup`)
14. **E1 renew-all** button on subscriptions page
15. **G3 WhatsApp reminder** toggle in profile
16. **D3 crumb link**, **D4 per-tool help link**, **D1 similar-tools cards**
17. **J1 signup step-1** centered 2-col
18. **C3 header CTA** relabel/remove
19. Table sticky-first-col ≤960px (billing + subscriptions)

## Phase 4 — Polish (P2/P3)

20. **E2 calendar strip**, **F1 invoice-PDF toast**, **B5 clear-recent**, **C7 newest sort**, compare (R2 if wanted), avatar upload, release-notes link

## Phase 5 — Lock for React

21. Migrate remaining inline `style=` to classes; update `MOCKUP-TO-REACT-PROMPT.md` with every new component/state; **user approval gate** → then React/Next build (separate project phase)

## Rules during implementation

- No new dependencies; vanilla JS only
- Every feature: light+dark verified, 360→1440 zero overflow, no console errors
- One commit per phase → push → verify Pages (cache-bust check via curl)
- Don't touch the extension source or React app
