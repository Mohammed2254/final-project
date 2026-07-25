# Stage 4 — Sprint Plan

## How we worked

The team did not run formal Scrum ceremonies logged in a single tool for
the full duration of Stage 4. Instead:

- **Weekly mentor reviews** (6 sessions across the project with Rakan
  Al-Otaibi, Abdullah Al-Jahdali, Linda Al-Mukrami, and Leen Al-Saleh)
  served as our external sprint reviews — we demoed current progress and
  incorporated feedback into the next iteration.
- **Near-daily internal check-ins** (WhatsApp + roughly weekly team
  syncs, ~10 sessions total) served as our stand-ups and lightweight
  planning/retro sessions.
- A **Jira board** was set up early for backend task tracking but was not
  maintained consistently throughout the stage due to team availability
  constraints.

Rather than reconstruct meetings that were not formally logged, this
sprint breakdown is built directly from our Git history — an accurate,
verifiable record of what was planned and delivered, week by week.

## Sprint 1 — Backend Foundation (Jun 27 – Jul 5)

**Goal:** Stand up the layered backend architecture and core auth flow.

| Priority | Task | Status |
|---|---|---|
| Must | Flask app factory, config, extensions | ✅ Done |
| Must | Account model + auth (register/login) | ✅ Done |
| Must | Base repository pattern | ✅ Done |
| Must | Service + provider profile models | ✅ Done |
| Should | JWT + password hashing helpers | ✅ Done |

**Commits this sprint:** 51 · **Primary owner:** Salman (backend)

## Sprint 2 — Core Features (Jul 6 – Jul 16)

**Goal:** Build the browsable catalog and booking flow, start the frontend.

| Priority | Task | Status |
|---|---|---|
| Must | Hall & photographer detail models/routes | ✅ Done |
| Must | Booking + booking items | ✅ Done |
| Must | Service media endpoints | ✅ Done |
| Must | Frontend: home, halls, photographers pages | ✅ Done |
| Should | Provider registration + service dashboard | ✅ Done |
| Should | Wedding plan service model | ✅ Done |

**Commits this sprint:** 33 · **Owners:** Salman (backend), Abdullah (frontend)

## Sprint 3 — Collaboration Features + Integration (Jul 17 – Jul 21)

**Goal:** Ship the differentiator (shared wedding planning) and close
frontend/backend integration gaps.

| Priority | Task | Status |
|---|---|---|
| Must | Favorites module (backend + frontend) | ✅ Done |
| Must | Wedding plan page (shared workspace) | ✅ Done |
| Must | Provider dashboard: media + booking management | ✅ Done |
| Should | Customer bookings list page | ✅ Done |
| Should | Fix cross-branch integration issues | ✅ Done |

**Commits this sprint:** 7 · **Owners:** Abdullah (frontend), Mohammed (integration)

## Sprint 4 — Hardening, Testing & Deployment (Jul 22 – Jul 26)

**Goal:** Make the MVP production-ready: secure, tested, and deployed.

| Priority | Task | Status |
|---|---|---|
| Must | Migrate from SQLite to PostgreSQL | ✅ Done |
| Must | Require JWT auth on all write endpoints | ✅ Done |
| Must | Automated test suite (unit + integration) | ✅ Done |
| Must | Fix production-only bugs (see bug tracking) | ✅ Done |
| Must | Deploy to production (Render) | ✅ Done |
| Should | Align API documentation with implementation | ✅ Done |
| Should | Real README with setup instructions | ✅ Done |

**Commits this sprint:** 12 · **Owner:** Mohammed (PM/SCM + full-stack)

## Overall metrics

| Metric | Value |
|---|---|
| Total commits (main) | 108 |
| Contributors | 3 active (Salman, Mohammed, Abdullah) |
| Sprints | 4, ~1 week each |
| Automated tests passing | 11/11 |
| Production bugs found & fixed post-deploy | 3 (see bug tracking) |
