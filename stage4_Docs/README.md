# Stage 4 — MVP Development & Execution · Deliverables

**Project:** Farah — Wedding Planning Platform
**Team:** Mohammed Al-Abdali, Salman Al-Ghannam, Abdullah Al-Daghaim
**Repository:** https://github.com/Mohammed2254/final-project

---

## 📦 Deliverables (Task 5)

| # | Deliverable | Link |
|---|---|---|
| 1 | **Production environment** | **https://farah-592g.onrender.com** |
| 2 | **Source repository** | https://github.com/Mohammed2254/final-project |
| 3 | **Sprint planning** | [`01_sprint_plan.md`](01_sprint_plan.md) |
| 4 | **Sprint reviews** | [`02_sprint_reviews.md`](02_sprint_reviews.md) |
| 5 | **Retrospectives** | [`03_retrospectives.md`](03_retrospectives.md) |
| 6 | **Bug tracking** | [`04_bug_tracking.md`](04_bug_tracking.md) · [GitHub Issues](https://github.com/Mohammed2254/final-project/issues) |
| 7 | **Testing evidence & results** | [`05_testing_evidence.md`](05_testing_evidence.md) |
| — | Team roles for this stage | [`00_team_roles.md`](00_team_roles.md) |

---

## 🚀 What was built

A deployed, working MVP where:

- **Couples** register, browse wedding halls and photographers, save
  favorites, create a wedding plan, invite a partner by code, approve
  service selections together, and place bookings.
- **Service providers** register, manage their service listings and
  images from a dashboard, and accept or reject booking requests.

**Stack:** React 19 + TypeScript + Vite + Tailwind · Flask + SQLAlchemy +
Marshmallow + JWT · PostgreSQL · deployed on Render as a single service
(Flask serves the built React app alongside the API).

---

## 📊 Stage 4 at a glance

| Metric | Value |
|---|---|
| Sprints | 4 (~1 week each) |
| Commits on `main` | 108 |
| Active contributors | 3 |
| API endpoints | 69 |
| Database tables | 14 |
| Automated tests | 11 (all passing) |
| Bugs tracked & resolved | 7 |
| Production deploys | 4 (3 failed → diagnosed → fixed → 1 succeeded) |

---

## 📝 A note on process honesty

Our Agile process in this stage was **lightweight and partly informal**:
weekly mentor reviews (6 sessions) and near-daily team check-ins over
WhatsApp, rather than fully-logged Scrum ceremonies in a single tool. A
Jira board was started for backend tasks but not maintained throughout.

Rather than reconstruct meetings that were never formally recorded,
these documents are built from **verifiable evidence**: our Git history,
the actual test suite output, and the real sequence of bugs found and
fixed during deployment. Where a practice was weak or missing (dedicated
QA, early testing, sprint tooling), we say so explicitly in the
[retrospective](03_retrospectives.md).
