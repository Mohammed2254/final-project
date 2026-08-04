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
| 2 | Providers register offerings, set pricing, and manage requests through a vendor dashboard by the end of Stage 4 | Providers register, list services with pricing, manage media, and accept/reject bookings from a dashboard. Registration + pricing landed in Sprint 2 (by Jul 16); media + booking management followed in Sprint 3 (Jul 17–21), about a week past the original date. | [`ProviderDashboardPage.tsx`](../frontend/src/features/provider/pages/ProviderDashboardPage.tsx) |
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
| Total commits (`main`) | 163 |
| Active contributors | 3 of 4 team members |
| API endpoints | 73 |
| Database tables | 14 |
| Automated tests | 127 — 61 backend, 66 frontend — all passing |
| Bugs found and fixed | 14 (3 security/authorization, 6 validation & data integrity, 5 deployment) |
| Production deploys | 4 during Stage 4 (3 failed and were fixed forward, 4th succeeded); every deploy since has been verified against a clean clone before pushing, with no failures |

Full detail behind these numbers: [Stage 4 deliverables](../stage4_Docs/README.md).

## What we deliberately left out

Straight from the Charter's own scope, plus limitations we documented
honestly in the [README](../README.md#ملاحظات-وحدود-حالية):

- **No payment processing in production.** Payments were out of scope in
  the Charter. A full Moyasar integration was built and tested afterward
  on the [`v5-payment`](https://github.com/Mohammed2254/final-project/tree/v5-payment)
  branch — card entry, server-side verification against the gateway, and
  an amount check against the booking total — but it is deliberately not
  deployed: Moyasar's test keys reject real cards, and its test card
  routes through an external 3-D Secure page that is not dependable
  during a live demo. A booking ends at `CONFIRMED` in production.
- No mobile app.
- **No real-time sync between partners.** Both partners see the shared
  plan, but a change by one requires the other to refresh. This is the
  fallback the Charter's own risk log described, not a shortcut.
- Schema changes go through `db.create_all()` on startup, not migrations
  (Flask-Migrate). Because `create_all()` creates missing tables but
  never alters existing ones, columns added later are applied by an
  explicit startup check ([`_add_missing_columns`](../back%20end/app/__init__.py)).
  Workable at this size; a real production app needs migrations.

## Delivered beyond the Charter

Three things shipped after the Stage 4 retrospective that the Charter
did not ask for, each closing a gap the MVP exposed in use:

- **Real image upload** (Cloudinary). Service photos were previously
  added by pasting a URL. The browser now uploads directly to Cloudinary
  and only the resulting URL reaches our server — no change to the
  existing `service-media` endpoint was needed.
- **Password reset by email** (Resend). The reset token is signed with a
  30-minute expiry rather than stored, so no new database column was
  required.
- **Booking straight from the shared plan.** Previously the plan was a
  dead end: partners could agree on services with no way to book them.
  All approved services now become a single booking, so the couple pays
  once for the total.

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
