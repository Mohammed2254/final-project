# Stage 4 — Testing Evidence & Results

**Totals: 47 automated tests, all passing** — 24 backend (pytest),
23 frontend (Vitest).

---

## 1. Backend test suite (pytest)

**How to run:**
```bash
cd "back end"
source app/.venv/bin/activate
python -m pytest -v
```

**Result — 24/24 passing:**

```
tests/integration/test_auth_flow.py::test_register_then_login_flow                        PASSED
tests/integration/test_auth_flow.py::test_register_rejects_invalid_email                  PASSED
tests/integration/test_auth_flow.py::test_login_with_wrong_password_returns_401           PASSED
tests/integration/test_auth_flow.py::test_create_service_requires_authentication          PASSED
tests/unit/test_auth_service.py::test_register_customer_returns_token_and_account         PASSED
tests/unit/test_auth_service.py::test_register_customer_rejects_duplicate_email           PASSED
tests/unit/test_auth_service.py::test_login_succeeds_with_correct_password                PASSED
tests/unit/test_auth_service.py::test_login_fails_with_wrong_password                     PASSED
tests/unit/test_auth_service.py::test_login_fails_for_unknown_email                       PASSED
tests/unit/test_booking_service.py::test_create_booking_sums_total_price                  PASSED
tests/unit/test_booking_service.py::test_create_booking_defaults_quantity_to_one          PASSED
tests/unit/test_favorite_service.py::test_add_favorite_saves_the_service                  PASSED
tests/unit/test_favorite_service.py::test_add_favorite_rejects_a_duplicate                PASSED
tests/unit/test_favorite_service.py::test_get_by_user_id_returns_only_that_users_favorites PASSED
tests/unit/test_favorite_service.py::test_get_by_user_id_is_empty_for_a_user_with_no_favorites PASSED
tests/unit/test_favorite_service.py::test_remove_favorite_deletes_it                      PASSED
tests/unit/test_favorite_service.py::test_remove_favorite_rejects_one_that_does_not_exist  PASSED
tests/unit/test_wedding_plan_selection_service.py::test_solo_plan_auto_approves_a_selection PASSED
tests/unit/test_wedding_plan_selection_service.py::test_shared_plan_selection_waits_for_partner_approval PASSED
tests/unit/test_wedding_plan_selection_service.py::test_partner_can_approve_a_pending_selection PASSED
tests/unit/test_wedding_plan_selection_service.py::test_partner_can_reject_a_pending_selection PASSED
tests/unit/test_wedding_plan_selection_service.py::test_a_non_member_cannot_add_a_service_to_the_plan PASSED
tests/unit/test_wedding_plan_selection_service.py::test_the_owner_cannot_join_their_own_plan_as_partner PASSED
tests/unit/test_wedding_plan_selection_service.py::test_a_plan_cannot_have_two_partners    PASSED

============================= 24 passed in 15.96s ==============================
```

### What the backend tests cover

| Area | Tests | Verifies |
|---|---|---|
| **Auth (integration, real HTTP)** | 4 | Register → login flow; invalid email rejected (400); wrong password rejected (401); **protected endpoint rejects unauthenticated writes (401)** |
| **Auth (unit)** | 5 | Registration returns token + profile; duplicate email rejected; login success and both failure paths |
| **Booking** | 2 | Total price calculation across items; default quantity of 1 |
| **Favorites** | 6 | Add, duplicate rejection, per-user isolation, empty state, removal, removing a non-existent favorite |
| **Shared wedding plan** | 7 | Solo plan auto-approves; shared plan waits for partner (`PENDING`); partner approve/reject; **non-members blocked**; owner can't be their own partner; a plan can't have two partners |

### Highlighted tests

- **`test_create_service_requires_authentication`** — a regression guard
  for BUG-01. If anyone removes `@jwt_required()` from service creation,
  this test fails immediately.
- **`test_shared_plan_selection_waits_for_partner_approval`** — covers
  the project's core differentiator: in a two-person plan, a selection
  cannot be finalized unilaterally.
- **`test_a_non_member_cannot_add_a_service_to_the_plan`** — an
  authorization test proving an outsider can't modify someone else's
  wedding plan.

### Test isolation

Tests run against an **in-memory SQLite database** (`TestingConfig`),
created fresh per test and destroyed after (`tests/conftest.py`), so
they never touch development or production data and always start from a
predictable state.

---

## 2. Frontend test suite (Vitest + React Testing Library)

**How to run:**
```bash
cd frontend
npm test
```

**Result — 23/23 passing across 5 files:**

```
 ✓ src/types/service.test.ts                                  (4 tests)
 ✓ src/store/createStore.test.ts                              (5 tests)
 ✓ src/components/common/EmptyState/EmptyState.test.tsx       (4 tests)
 ✓ src/components/common/EmptyState/ErrorState.test.tsx       (3 tests)
 ✓ src/features/auth/schemas/auth.schema.test.ts              (7 tests)

 Test Files  5 passed (5)
      Tests  23 passed (23)
```

### What the frontend tests cover

| File | Tests | Verifies |
|---|---|---|
| `service.test.ts` | 4 | The `toServiceItem` transformer: snake_case → camelCase mapping, **price string → number conversion**, null handling |
| `createStore.test.ts` | 5 | The app's state store: partial merges, updater functions, subscriber notifications, unsubscribe |
| `EmptyState.test.tsx` | 4 | Renders title/description/action correctly; omits description when absent |
| `ErrorState.test.tsx` | 3 | Error message in an `alert` role; retry button hidden without a handler; **click actually calls `onRetry`** |
| `auth.schema.test.ts` | 7 | Registration validation: password mismatch flagged on the right field, short password rejected, invalid email rejected, short name rejected; login validation |

### Why these areas

They cover the logic most likely to break silently:
- **Data transformation** — the boundary between backend and UI shapes
  (a wrong price conversion would show incorrect prices site-wide).
- **State store** — every authenticated screen depends on it.
- **Form validation** — the only thing standing between bad input and
  the API.
- **Shared UI states** — the empty/error components used across every
  list page.

---

## 3. Type checking & linting

```bash
cd frontend
npx tsc -b        # TypeScript → 0 errors
npx eslint .      # ESLint → 0 errors (1 known warning from react-hook-form)
npm run build     # Production build → succeeds
```

---

## 4. Manual & exploratory testing

### Pre-deployment verification (local, simulating production)

The built frontend was served by Flask locally and verified before each
production push:

| Check | Expected | Result |
|---|---|---|
| `GET /` | Serves React app | ✅ 200 |
| `GET /halls` | SPA fallback → React Router handles it | ✅ 200 |
| `GET /api/service-categories/` | Public API, returns seeded categories | ✅ 200 |
| `GET /api/services/` | Public read allowed | ✅ 200 |
| `POST /api/services/` *(no token)* | Rejected | ✅ 401 |
| `GET /api/bookings/customer/me` *(no token)* | Rejected | ✅ 401 |

### Clean-environment verification

Each deployment bug was verified in an environment mirroring production,
not just locally:

- **BUG-05 (`flask_cors`)** — created a brand-new virtual environment,
  installed *only* from `requirements.txt`, confirmed the app boots.
- **BUG-06 (`.gitignore`)** — performed a fresh `git clone` into a temp
  directory and ran `npm install && npm run build`, proving the missing
  file was now genuinely in version control.
- **BUG-07 (API URL)** — inspected the compiled production bundle to
  confirm the hardcoded `localhost:5000` URL was gone.

### Post-deployment verification (production)

Tested against **https://farah-592g.onrender.com**:

| Test | Result |
|---|---|
| Site loads | ✅ Pass |
| Register a new customer account | ✅ Pass |
| Log out | ✅ Pass |
| Log back in with the same account | ✅ Pass |

---

## 5. Remaining gaps

- **No end-to-end (E2E) browser tests** (e.g. Playwright/Cypress) —
  full user journeys are verified manually.
- **Provider service management and booking status transitions** are
  covered by manual testing rather than automated tests.
- **No load or performance testing** was performed.
