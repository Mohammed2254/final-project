# Stage 4 — Team Roles

Roles rotated between stages so everyone got experience on both the
technical and organizational side. For Stage 4:

| Member | Role(s) | What they did |
|---|---|---|
| **Mohammed Al-Abdali** | Project Manager · Source Control Manager · Full-stack | Set sprint priorities and deadlines; managed branches, merge conflicts, and keeping `Dev` and `main` in sync; built features and fixes on both sides (customer bookings page, JWT enforcement, PostgreSQL migration, test suites, deployment). |
| **Salman Al-Ghannam** | Technical Lead · Backend | Designed and built the backend architecture and most of its resources — auth, services, halls, bookings, wedding plans. |
| **Abdullah Al-Daghaim** | Frontend | Built frontend features: home, halls, photographers, authentication screens, favorites, wedding plan page. |
| **Fahad Al-Anazi** | — | Assigned Developer + QA in earlier stages; did not take part in Stage 4. |

## About the QA role

Fahad was inactive this stage and nobody formally took over QA. Testing
ended up shared:

- Whoever built a feature verified it manually.
- A test suite was added in Sprint 4 — 47 tests (24 backend, 23
  frontend), all passing. See [`05_testing_evidence.md`](05_testing_evidence.md).
- Before each production push we ran build checks, clean-environment
  installs, and endpoint smoke tests.

Leaving QA unassigned is the main reason testing came late. We say so
in the [retrospective](03_retrospectives.md) rather than describe a QA
process we didn't have.
