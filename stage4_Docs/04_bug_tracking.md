# Stage 4 — Bug Tracking

Bugs are also tracked as GitHub Issues on the repository (closed, each
linked to its fixing commit): `https://github.com/Mohammed2254/final-project/issues`

This document summarizes each bug for readers who don't want to open
GitHub separately.

---

### BUG-01 — Unauthenticated write endpoints on core resources

- **Severity:** High (security)
- **Found:** Code review of route protection during Sprint 4.
- **Description:** `POST/PUT/DELETE` on `/api/services`, `/api/halls`,
  and `/api/photographers` had no `@jwt_required()` decorator. Any
  unauthenticated client could create, edit, or delete another
  provider's listings.
- **Root cause:** JWT infrastructure was built early, but enforcement
  was never added to these specific routes as they were written.
- **Fix:** Added `@jwt_required()` to all write endpoints on the
  affected routes; the owning provider is now derived from the JWT
  instead of trusted from the request body.
- **Commits:** `0fc95b2`, `7283105`
- **Verified by:** Automated test asserting `401` on an unauthenticated
  `POST /api/services/` (see `05_testing_evidence.md`).

### BUG-02 — `back end/.env` committed to version control

- **Severity:** High (security)
- **Found:** Repository audit.
- **Description:** The `.env` file containing `SECRET_KEY`,
  `JWT_SECRET_KEY`, and database credentials was tracked in Git and
  had been pushed to GitHub since early in the project.
- **Fix:** Removed from Git tracking (`git rm --cached`), added to
  `.gitignore`, and rotated all secrets that had been exposed.
- **Commit:** `3a6bde0`

### BUG-03 — Oversized `media_url` crashes with a raw 500 error

- **Severity:** Medium
- **Found:** Manual testing while adding a service image.
- **Description:** Pasting a Google Images search-result URL (over 500
  characters) into the media URL field caused an unhandled
  `StringDataRightTruncation` database error, returned to the user as a
  generic `500 Internal Server Error`.
- **Root cause:** The `media_url` database column is `VARCHAR(500)`,
  but the Marshmallow schema had no matching length validation, so the
  bad input reached the database layer instead of being rejected
  earlier with a clear message.
- **Fix:** Added `validate.Length(max=500)` to the schema, turning the
  failure into a clean `400 Validation failed` response.
- **Commit:** `3a6bde0`

### BUG-04 — Empty `service_categories` table blocks service creation

- **Severity:** Medium
- **Found:** Manual testing on a freshly-created database.
- **Description:** Creating a service requires a valid `category_id`,
  but no category rows existed until manually seeded — so the feature
  was unusable on any new database, including every teammate's local
  setup and the production database.
- **Fix:** Added an automatic seed step (`_seed_service_categories`)
  that runs on app startup and inserts the two base categories if the
  table is empty.
- **Verified by:** Confirmed on the PostgreSQL migration and again
  independently on the first production deploy.

### BUG-05 — `ModuleNotFoundError: flask_cors` on first production deploy

- **Severity:** High (blocked deployment entirely)
- **Found:** First Render deployment attempt.
- **Description:** The app crashed on startup in production with
  `ModuleNotFoundError: No module named 'flask_cors'`.
- **Root cause:** `Flask-Cors` had been installed manually in every
  developer's local virtual environment at some point, but was never
  added to `requirements.txt` — so it worked locally by accident and
  failed on Render's clean environment.
- **Fix:** Added `Flask-Cors==6.0.5` to `requirements.txt`. Verified by
  installing from a brand-new virtual environment using only
  `requirements.txt` before redeploying.
- **Commit:** `be24721`

### BUG-06 — `.gitignore` silently excluded a required frontend file

- **Severity:** High (blocked deployment entirely)
- **Found:** Second Render deployment attempt (frontend build failed).
- **Description:** Build failed with `Cannot find module '@/lib/utils'`
  across 26 files, even though the file existed and worked on every
  developer's machine.
- **Root cause:** A generic Python `lib/` rule in `.gitignore` (intended
  for virtual environment folders) matched `frontend/src/lib/` too, so
  `utils.ts` was never actually pushed to GitHub — only local copies
  existed.
- **Fix:** Added an explicit negation (`!frontend/src/lib/`) to
  `.gitignore` and force-added the file. Verified with a completely
  fresh `git clone` + `npm run build` before redeploying.
- **Commit:** `d554614`

### BUG-07 — Hardcoded `localhost` API URL breaks production entirely

- **Severity:** High (site loaded but was 100% non-functional)
- **Found:** Third Render deployment attempt (site loaded, every action
  failed).
- **Description:** After the site successfully loaded, every API call
  failed with "Unable to reach the server."
- **Root cause:** Vite environment variables are resolved at *build
  time*. The build had no `VITE_API_BASE_URL` set, so it fell back to
  `http://localhost:5000/api` — which was baked permanently into the
  production JavaScript bundle. Every visitor's browser tried to reach
  their own machine instead of the real server.
- **Fix:** Changed the fallback to use a relative `/api` path in
  production builds (`import.meta.env.DEV` check), since the backend
  now serves the frontend from the same origin — no environment
  variable needed.
- **Commit:** `3907bfe`

---

## Summary

| # | Severity | Area | Status |
|---|---|---|---|
| 01 | High | Security | ✅ Fixed |
| 02 | High | Security | ✅ Fixed |
| 03 | Medium | Validation | ✅ Fixed |
| 04 | Medium | Data | ✅ Fixed |
| 05 | High | Deployment | ✅ Fixed |
| 06 | High | Deployment | ✅ Fixed |
| 07 | High | Deployment | ✅ Fixed |

**7/7 bugs found were fixed and verified**, each with an isolated,
reproducible verification step (fresh venv, fresh clone, or an
automated test) rather than "redeploy and hope."
