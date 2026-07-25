# Stage 4 — Testing Evidence & Results

## 1. Automated test suite

**How to run:**
```bash
cd "back end"
source app/.venv/bin/activate
python -m pytest -v
```

**Result (11/11 passing):**

```
platform linux -- Python 3.12.3, pytest-8.4.1
rootdir: back end
configfile: pytest.ini
testpaths: tests
collected 11 items

tests/integration/test_auth_flow.py::test_register_then_login_flow           PASSED [  9%]
tests/integration/test_auth_flow.py::test_register_rejects_invalid_email     PASSED [ 18%]
tests/integration/test_auth_flow.py::test_login_with_wrong_password_returns_401 PASSED [ 27%]
tests/integration/test_auth_flow.py::test_create_service_requires_authentication PASSED [ 36%]
tests/unit/test_auth_service.py::test_register_customer_returns_token_and_account PASSED [ 45%]
tests/unit/test_auth_service.py::test_register_customer_rejects_duplicate_email  PASSED [ 54%]
tests/unit/test_auth_service.py::test_login_succeeds_with_correct_password   PASSED [ 63%]
tests/unit/test_auth_service.py::test_login_fails_with_wrong_password        PASSED [ 72%]
tests/unit/test_auth_service.py::test_login_fails_for_unknown_email          PASSED [ 81%]
tests/unit/test_booking_service.py::test_create_booking_sums_total_price     PASSED [ 90%]
tests/unit/test_booking_service.py::test_create_booking_defaults_quantity_to_one PASSED [100%]

============================== 11 passed in 5.96s ==============================
```

### Coverage breakdown

| Type | Count | What it verifies |
|---|---|---|
| **Integration** (over real HTTP) | 4 | Full register → login flow; invalid email rejected (400); wrong password rejected (401); **protected endpoint rejects unauthenticated writes (401)** |
| **Unit** (service layer, isolated) | 7 | `AuthService`: registration, duplicate-email rejection, login success/failure paths. `BookingService`: total price calculation, default quantity handling. |

### Test isolation strategy

Tests run against an **in-memory SQLite database** (`TestingConfig`),
created fresh for each test and destroyed afterwards
(`tests/conftest.py`). This means:
- Tests never touch real development or production data.
- Each test starts from a clean, predictable state.

### Notable test

`test_create_service_requires_authentication` is a **regression guard**
for BUG-01: if anyone removes `@jwt_required()` from the service
creation endpoint in the future, this test fails immediately.

---

## 2. Type checking & linting (frontend)

```bash
cd frontend
npx tsc -b        # TypeScript type check → 0 errors
npx eslint .      # ESLint → 0 errors (1 known warning from react-hook-form)
npm run build     # Production build → succeeds
```

---

## 3. Manual / exploratory testing

### Pre-deployment verification (local, simulating production)

Before each production push, the built frontend was served by Flask
locally and verified:

| Check | Expected | Result |
|---|---|---|
| `GET /` | Serves React app (contains `<div id="root">`) | ✅ 200 |
| `GET /halls` | SPA fallback → React Router handles route | ✅ 200 |
| `GET /api/service-categories/` | Public API returns seeded categories | ✅ 200 |
| `GET /api/services/` | Public read allowed | ✅ 200 |
| `POST /api/services/` *(no token)* | Rejected | ✅ 401 |
| `GET /api/bookings/customer/me` *(no token)* | Rejected | ✅ 401 |

### Clean-environment verification

Each deployment bug fix was verified in an environment that mirrors the
production build, not just locally:

- **BUG-05 (`flask_cors`)**: created a brand-new Python virtual
  environment, installed *only* from `requirements.txt`, and confirmed
  the app boots — proving no hidden local dependency remained.
- **BUG-06 (`.gitignore`)**: performed a completely fresh `git clone`
  of the repository into a temp directory and ran `npm install && npm
  run build` — proving the required file was now actually in version
  control.
- **BUG-07 (API URL)**: inspected the compiled production bundle to
  confirm the hardcoded `localhost:5000` API URL was gone before
  redeploying.

### Post-deployment verification (production)

Tested directly against **https://farah-592g.onrender.com**:

| Test | Result |
|---|---|
| Site loads | ✅ Pass |
| Register a new customer account | ✅ Pass |
| Log out | ✅ Pass |
| Log back in with the same account | ✅ Pass |

---

## 4. Known gaps (stated honestly)

- **No frontend automated tests.** All frontend verification was manual
  plus type checking; no Vitest/React Testing Library suite exists yet.
- **Backend coverage is partial.** The 11 tests cover authentication and
  booking calculation — the highest-risk logic — but favorites, wedding
  plans, and provider services are covered only by manual testing.
- **No load or performance testing** was performed.

These are documented as future work rather than presented as complete.
