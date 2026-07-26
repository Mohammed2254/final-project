# Stage 4 — Bug Tracking

Seven bugs were found and fixed during this stage. Each one below links
to the commit that fixed it, so anything here can be checked against the
repository.

---

### BUG-01 — Write endpoints had no authentication

**Severity:** High (security) · **Fixed in:** `0fc95b2`, `7283105`

`POST`, `PUT`, and `DELETE` on `/api/services`, `/api/halls`, and
`/api/photographers` had no `@jwt_required()`. Anyone could create,
edit, or delete another provider's listings without logging in.

We had JWT set up from early on but never applied it to these routes as
they were written. Fix: added `@jwt_required()` to every write endpoint
on those routes, and the owning provider is now read from the token
instead of trusted from the request body.

Covered by a test (`test_create_service_requires_authentication`) so it
can't silently regress.

---

### BUG-02 — `.env` was committed to the repository

**Severity:** High (security) · **Fixed in:** `3a6bde0`

The `.env` file with `SECRET_KEY`, `JWT_SECRET_KEY`, and database
credentials was tracked in Git and had been on GitHub since early in
the project. Removed from tracking, added to `.gitignore`, and the
exposed secrets were rotated.

---

### BUG-03 — Long image URL crashed with a raw 500

**Severity:** Medium · **Fixed in:** `3a6bde0`

Pasting a Google Images search URL (over 500 characters) into the media
field returned a `500 Internal Server Error`. The `media_url` column is
`VARCHAR(500)` but the schema had no length validation, so bad input
reached the database instead of being rejected earlier.

Fix: added `validate.Length(max=500)` to the schema — now it returns a
clean `400` with a readable message.

---

### BUG-04 — Empty categories table blocked creating services

**Severity:** Medium

Creating a service requires a valid `category_id`, but no categories
existed until someone seeded them manually. That meant the feature was
broken on every fresh database — each teammate's local setup and later
the production database.

Fix: the app now seeds the two base categories on startup if the table
is empty.

---

### BUG-05 — `flask_cors` missing from requirements

**Severity:** High, blocked deployment · **Fixed in:** `be24721`

First deploy crashed with `ModuleNotFoundError: No module named
'flask_cors'`. The package had been installed manually in each
developer's virtual environment but was never added to
`requirements.txt`, so it worked locally by accident.

Verified the fix by creating a brand-new virtual environment, installing
only from `requirements.txt`, and confirming the app boots.

---

### BUG-06 — `.gitignore` excluded a required frontend file

**Severity:** High, blocked deployment · **Fixed in:** `d554614`

Frontend build failed with `Cannot find module '@/lib/utils'` across 26
files — even though the file existed and worked on our machines.

A generic Python `lib/` rule in `.gitignore` (meant for virtual
environment folders) also matched `frontend/src/lib/`, so `utils.ts` was
never pushed to GitHub. Only local copies existed.

Fix: added an explicit exception (`!frontend/src/lib/`) and committed
the file. Verified with a fresh `git clone` plus `npm run build`.

---

### BUG-07 — Production site pointed at `localhost`

**Severity:** High, site was unusable · **Fixed in:** `3907bfe`

The site loaded but every action failed with a network error.

Vite resolves environment variables at build time. With no
`VITE_API_BASE_URL` set during the Render build, the fallback
`http://localhost:5000/api` got baked into the production bundle — so
every visitor's browser was trying to reach their own machine.

Fix: production builds now use a relative `/api` path, which works
because Flask serves the frontend from the same origin.

---

## Summary

| Bug | Severity | Area | Status |
|---|---|---|---|
| 01 | High | Security | Fixed |
| 02 | High | Security | Fixed |
| 03 | Medium | Validation | Fixed |
| 04 | Medium | Data | Fixed |
| 05 | High | Deployment | Fixed |
| 06 | High | Deployment | Fixed |
| 07 | High | Deployment | Fixed |

All seven were fixed and verified — either with an automated test or by
reproducing in a clean environment (fresh virtual environment, fresh
clone) rather than redeploying and hoping.
