# Stage 4 — MVP Development & Execution · Deliverables

**Project:** Farah — Wedding Planning Platform
**Team:** Mohammed Al-Abdali, Salman Al-Ghannam, Abdullah Al-Daghaim
**Repository:** https://github.com/Mohammed2254/final-project

---

## Deliverables (Task 5)

| Deliverable | Link |
|---|---|
| **Production environment** | **https://farah-592g.onrender.com** |
| **Source repository** | https://github.com/Mohammed2254/final-project |
| Sprint planning | [`01_sprint_plan.md`](01_sprint_plan.md) |
| Sprint reviews | [`02_sprint_reviews.md`](02_sprint_reviews.md) |
| Retrospectives | [`03_retrospectives.md`](03_retrospectives.md) |
| Bug tracking | [`04_bug_tracking.md`](04_bug_tracking.md) |
| Testing evidence & results | [`05_testing_evidence.md`](05_testing_evidence.md) |
| Team roles for this stage | [`00_team_roles.md`](00_team_roles.md) |

---

## What was built

A deployed MVP where:

- **Couples** register, browse wedding halls and photographers, save
  favorites, create a wedding plan, invite a partner by code, approve
  service selections together, and place bookings.
- **Service providers** register, manage their listings and images from
  a dashboard, and accept or reject booking requests.

**Stack:** React 19 + TypeScript + Vite + Tailwind · Flask + SQLAlchemy +
Marshmallow + JWT · PostgreSQL. Deployed on Render as a single service —
Flask serves the built React app alongside the API.

---

## Stage 4 numbers

| | |
|---|---|
| Sprints | 4 (about a week each) |
| Commits on `main` | 108 |
| Active contributors | 3 |
| API endpoints | 69 |
| Database tables | 14 |
| Automated tests | 47 (24 backend, 23 frontend) — all passing |
| Bugs tracked and fixed | 7 |
| Production deploys | 4 (3 failed, diagnosed, fixed; 4th succeeded) |

---

## How to run the tests

```bash
# Backend
cd "back end" && source app/.venv/bin/activate && python -m pytest -v

# Frontend
cd frontend && npm test
```

---

## Note on our process

Our Agile process this stage was lightweight and partly informal: weekly
mentor reviews (6 sessions) and near-daily check-ins over WhatsApp,
rather than fully logged ceremonies in one tool. A Jira board was set up
early for backend tasks but wasn't kept up to date.

Instead of writing up meetings we never recorded, these documents are
built from evidence we can actually point to: the Git history, the test
suite output, and the real sequence of bugs we hit while deploying.
Where our process fell short, the [retrospective](03_retrospectives.md)
says so directly.
