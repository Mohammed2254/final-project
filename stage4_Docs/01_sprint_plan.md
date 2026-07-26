# Stage 4 — Sprint Plan

## How we planned

We didn't run formal Scrum ceremonies logged in one tool. What we
actually did:

- **Weekly mentor sessions** (6 across the project, with Rakan
  Al-Otaibi, Abdullah Al-Jahdali, Linda Al-Mukrami, and Leen Al-Saleh) —
  we showed progress and adjusted priorities based on feedback.
- **Near-daily check-ins** over WhatsApp plus roughly weekly team calls
  (~10 sessions) — where we split work and flagged blockers.
- A **Jira board** created early for backend tasks, which we stopped
  maintaining.

So instead of reconstructing sprint meetings we never wrote down, the
breakdown below comes from our Git history — what was actually built,
week by week.

## Sprint 1 — Backend foundation (Jun 27 – Jul 5)

**Goal:** Get the layered backend structure and auth working.

| Priority | Task | Status |
|---|---|---|
| Must | App factory, config, extensions | Done |
| Must | Account model + register/login | Done |
| Must | Base repository pattern | Done |
| Must | Service and provider profile models | Done |
| Should | JWT and password hashing helpers | Done |

**51 commits** · Lead: Salman

## Sprint 2 — Core features (Jul 6 – Jul 16)

**Goal:** Build the catalog and booking flow, start the frontend.

| Priority | Task | Status |
|---|---|---|
| Must | Hall and photographer detail models/routes | Done |
| Must | Bookings + booking items | Done |
| Must | Service media endpoints | Done |
| Must | Frontend: home, halls, photographers | Done |
| Should | Provider registration + service dashboard | Done |
| Should | Wedding plan service model | Done |

**33 commits** · Salman (backend), Abdullah (frontend)

## Sprint 3 — Shared planning + integration (Jul 17 – Jul 21)

**Goal:** Ship the shared wedding planning feature and close the gaps
between frontend and backend.

| Priority | Task | Status |
|---|---|---|
| Must | Favorites (backend + frontend) | Done |
| Must | Wedding plan page (shared workspace) | Done |
| Must | Provider dashboard: media + bookings | Done |
| Should | Customer bookings list page | Done |
| Should | Resolve cross-branch integration issues | Done |

**7 commits** · Abdullah (frontend), Mohammed (integration)

## Sprint 4 — Hardening, testing, deployment (Jul 22 – Jul 26)

**Goal:** Make it production-ready.

| Priority | Task | Status |
|---|---|---|
| Must | Migrate SQLite → PostgreSQL | Done |
| Must | Require JWT on all write endpoints | Done |
| Must | Automated tests (backend + frontend) | Done |
| Must | Fix production-only bugs | Done |
| Must | Deploy to production | Done |
| Should | Align API docs with the real implementation | Done |
| Should | Write a proper README | Done |

**12 commits** · Mohammed (PM/SCM + full-stack)

## Metrics

| | |
|---|---|
| Total commits on `main` | 108 |
| Active contributors | 3 |
| Sprints | 4, about a week each |
| Tests at end of Stage 4 | 47 passing (0 at the start) |
| Bugs found and fixed | 7 |
