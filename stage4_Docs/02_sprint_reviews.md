# Stage 4 — Sprint Reviews

Reviews happened mainly in our **weekly mentor sessions** (6 across the
project), where we showed what was working and took feedback into the
next week. We also reviewed progress informally in team check-ins.

We didn't keep written minutes of every session. What follows is what
was demonstrable at the end of each sprint, based on the state of the
code at that point (verifiable in the Git history).

## Sprint 1 — Backend foundation

**Shown:** Account registration and login working through Postman, and
the layered backend structure (routes / services / repositories /
models) applied to the `Account` and `Service` resources.

**Outcome:** The pattern was approved, and every resource after this
followed it.

## Sprint 2 — Catalog and booking

**Shown:** The frontend listing real halls and photographers pulled from
the backend, and a booking created with multiple items.

**Outcome:** The main user journey — browse, then book — worked
end to end for the first time.

## Sprint 3 — Shared wedding planning

**Shown:** A couple creating a shared plan, inviting a partner with a
code, and both members approving service selections.

**Outcome:** The feature that separates Farah from a plain booking site
was working.

## Sprint 4 — Production readiness

**Shown:**
- 47 automated tests passing (24 backend, 23 frontend).
- The live site: **https://farah-592g.onrender.com**
- Security check: unauthenticated requests to protected endpoints
  correctly rejected with 401.

**Outcome:** MVP feature-complete and live.
