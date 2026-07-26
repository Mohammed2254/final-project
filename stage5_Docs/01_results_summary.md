# Stage 5 — Results Summary

**Project:** Farah — Wedding Planning Platform
**Live at:** https://farah-592g.onrender.com
**Repository:** https://github.com/Mohammed2254/final-project
**Timeline:** May 16 – July 26, 2026 (Stage 1 through Stage 4 delivery)

---

## What we set out to build

From the [Project Charter](../stage2_report.md): a platform that lets
engaged couples browse and book wedding services, and — the part that
made this idea different from anything else in the Saudi market — plan
together as two people instead of one, even when they're not in the
same room.

## Objectives vs. what we delivered

The Charter set three objectives. All three shipped.

| # | Objective (Charter target) | Delivered | Evidence |
|---|---|---|---|
| 1 | Browse and book at least two service categories — halls and photographers — within 4 weeks of the development stage | Both categories are live: listing pages (with filters), detail pages, and booking. Shipped in Sprint 2 (Jul 6–16), on the edge of the 4-week window. | [`HallsListPage`](../frontend/src/features/halls/pages/HallsListPage.tsx), [`PhotographersListPage`](../frontend/src/features/photographers/pages/PhotographersListPage.tsx), `POST /api/bookings` |
| 2 | Providers register offerings, set pricing, and manage requests through a vendor dashboard by the end of Stage 4 | Providers register, list services with pricing, manage media, and accept/reject bookings from a dashboard. Registration + pricing landed in Sprint 2 (by Jul 16); media + booking management followed in Sprint 3 (Jul 17–21), about a week past the original date. | [`ProviderDashboardPage.tsx`](../frontend/src/pages/ProviderDashboardPage.tsx) |
| 3 | A shared couple workspace where both partners make booking decisions together in the same session | Working end to end: create a plan, invite a partner by code, add a service, partner approves or rejects. A solo plan auto-approves; a shared one waits. This is the project's core differentiator and it works. Shipped in Sprint 3 (Jul 17–21). | 7 dedicated tests in [`test_wedding_plan_selection_service.py`](../back%20end/tests/unit/test_wedding_plan_selection_service.py) |

## The MVP, in one paragraph

A couple registers, browses halls and photographers, saves favorites,
and either books directly or opens a shared wedding plan and invites
their partner by code. Every service either of them adds waits for the
other's approval before it's confirmed. On the other side, a provider
registers, lists their services with pricing and photos, and accepts or
rejects booking requests from a dashboard. Everything above is live in
production, not just running locally.

## By the numbers

| | |
|---|---|
| Total commits (`main`) | 112 |
| Active contributors | 3 of 4 team members |
| API endpoints | 63 |
| Database tables | 14 |
| Automated tests | 47 — 24 backend, 23 frontend — all passing |
| Bugs found and fixed | 7 (2 security, 2 validation/data, 3 deployment) |
| Production deploy attempts | 4 during Stage 4 (3 failed and were fixed forward, 4th succeeded) + 2 further clean deploys since, both verified end-to-end before pushing |

Full detail behind these numbers: [Stage 4 deliverables](../stage4_Docs/README.md).

## What we deliberately left out

Straight from the Charter's own scope, plus limitations we documented
honestly in the [README](../README.md#ملاحظات-وحدود-حالية):

- No real payment processing — out of scope from the Charter; the
  payments screen is a "coming soon" placeholder with no logic behind it.
- No mobile app.
- No file upload for service photos — images are added by pasting a
  URL. A real upload/storage layer wasn't built.
- Schema changes go through `db.create_all()` on startup, not migrations
  (Flask-Migrate). Fine for a project this size; would need to change
  for a real production app that evolves its schema over time.

None of these are things that got forgotten — they're the same list from
Stage 2, still true.

## Timeline vs. plan

The Charter gave Stage 4 four weeks (June 18 – July 16). In practice,
the last two sprints — the shared wedding plan feature, then hardening
and deployment — ran from July 17 to July 26, about ten days past that
date, inside what the Charter had marked as Stage 5. We didn't hide
this or rewrite the record to fit the plan: the [sprint
plan](../stage4_Docs/01_sprint_plan.md) shows the real dates, and it's
called out directly in the [lessons learned](02_lessons_learned.md).

The trade-off was deliberate in the moment: keep building until the
MVP was actually complete and deployed, rather than stop on a date with
an unfinished product. Every objective in the Charter shipped — just
later than originally planned.
