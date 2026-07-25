# Stage 4 — Team Roles

Roles rotated across stages so every member gained both technical and
organizational experience (see Stage 1 report). For Stage 4 specifically,
the team operated as follows:

| Member | Stage 4 Role(s) | Responsibilities |
|---|---|---|
| **Mohammed Al-Abdali** | Project Manager + Source Control Manager + Full-Stack Developer | Coordinated sprint priorities and deadlines; managed branch strategy, merge conflicts, and kept `Dev`/`main` in sync; implemented features and fixes across both frontend and backend (bookings feature, security hardening, PostgreSQL migration, deployment). |
| **Salman Al-Ghannam** | Technical Team Lead + Backend Developer | Owned the core backend architecture (layered structure: routes → schemas → services → repositories → models); implemented the majority of backend resources (auth, services, halls, bookings, wedding plans). |
| **Abdullah Al-Daghaim** | Frontend Developer | Implemented frontend features (home, halls, photographers, authentication, favorites, wedding plan) following the feature-based architecture. |
| **Fahad Al-Anazi** | *Inactive this stage* | Was originally assigned Developer + QA in earlier stages; did not participate in Stage 4 execution. |

## Note on the QA role

With Fahad inactive during Stage 4, dedicated QA was not staffed as a
separate role. Testing responsibilities were absorbed collectively:
- Manual verification of each feature by whoever implemented it.
- A formal automated test suite (11 passing tests covering auth and
  booking flows) was added and verified before every deployment step —
  see `05_testing_evidence.md`.
- Pre-deployment smoke testing (build verification, fresh-environment
  installs, endpoint checks) was performed before each production push.

This is a known gap we address honestly rather than claim a QA process
that did not formally exist — see `03_retrospectives.md`.
