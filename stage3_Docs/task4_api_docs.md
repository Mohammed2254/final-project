# API Documentation — Farah

> This document reflects the API **as actually implemented**. Where the
> original Stage 3 plan differed (versioned `/v1` paths, a `status`
> envelope, pagination, a Moyasar/Maps/Cloudinary integration), those were
> adjusted or deferred during development — see the notes at the end.

## 1. External APIs (planned)

These integrations were planned in the design stage but are **not yet
implemented** in the MVP. They are documented here as intended future work.

| External API | Purpose | Status |
|---|---|---|
| **Moyasar API** | Payment processing for bookings | Planned — no payment flow is implemented yet. |
| **Google Maps API** | Displaying venue locations | Planned — halls store `latitude`/`longitude`, but no map is rendered. |
| **Cloudinary API** | Hosting media files | Planned — for now, service images are stored as direct image URLs in `service_media.media_url`; no upload/hosting layer exists. |

---

## 2. Internal API Endpoints

The API follows RESTful conventions and returns a consistent JSON envelope.
Protected endpoints require an `Authorization: Bearer <JWT_TOKEN>` header.

**Response envelope**

```json
// Success
{ "success": true, "message": "...", "data": {} }

// Error
{ "success": false, "message": "...", "errors": {} }
```

All paths are prefixed with `/api` (there is no `/v1` versioning at this time).

---

### Authentication

#### Register a Customer
- **Path:** `/api/auth/register/customer`
- **Method:** `POST`
- **Auth:** Not required
- **Input:**
```json
{
  "full_name": "Mohammed Al-Abdali",
  "email": "user@example.com",
  "password": "StrongPass123"
}
```
- **Output (201 Created):**
```json
{
  "success": true,
  "message": "Customer registered successfully.",
  "data": {
    "access_token": "<JWT_TOKEN>",
    "account": { "account_id": 12, "email": "user@example.com", "role": "Customer" },
    "user_profile": { "user_profile_id": 5, "full_name": "Mohammed Al-Abdali" }
  }
}
```

#### Register a Provider
- **Path:** `/api/auth/register/provider`
- **Method:** `POST`
- **Auth:** Not required
- **Input:**
```json
{
  "business_name": "Royal Events",
  "phone_number": "0555000111",
  "description": "Luxury wedding venues in Riyadh.",
  "email": "provider@example.com",
  "password": "StrongPass123"
}
```
- **Output (201 Created):** same envelope, with `account` (role `Provider`) and
  a `provider_profile` object.

#### Login
- **Path:** `/api/auth/login`
- **Method:** `POST`
- **Auth:** Not required
- **Input:**
```json
{
  "email": "user@example.com",
  "password": "StrongPass123"
}
```
- **Output (200 OK):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "access_token": "<JWT_TOKEN>",
    "role": "Customer",
    "account": { "account_id": 12, "email": "user@example.com", "role": "Customer" },
    "user_profile": { "user_profile_id": 5, "full_name": "Mohammed Al-Abdali" }
  }
}
```
> A provider login returns `provider_profile` instead of `user_profile`.
> Wrong credentials return **401**; a validation error returns **400**.

---

### Services (Halls & Photographers)

Halls and photographers are both `Service` records, distinguished by their
category and their detail rows (`hall_details` / `photographer_details`).

#### List Active Services
- **Path:** `/api/services/`
- **Method:** `GET`
- **Auth:** Not required
- **Output (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "service_id": 105,
      "provider_profile_id": 3,
      "category_id": 1,
      "service_name": "Royal Hall",
      "description": "Luxury wedding venue in north Riyadh.",
      "price": "18000.00",
      "is_active": true,
      "created_at": "2026-07-10T12:00:00"
    }
  ]
}
```

#### Search Services by Name
- **Path:** `/api/services/search?keyword=royal`
- **Method:** `GET`
- **Auth:** Not required
- **Output:** same list shape, filtered by name.

#### Services by Category
- **Path:** `/api/services/category/{category_id}`
- **Method:** `GET`
- **Auth:** Not required

#### Get Service Details
- **Path:** `/api/services/{service_id}`
- **Method:** `GET`
- **Auth:** Not required

#### Hall / Photographer Detail Rows
- **Path:** `/api/halls/service/{service_id}` · `/api/photographers/service/{service_id}`
- **Method:** `GET`
- **Auth:** Not required
- Returns capacity/city/address (halls) or coverage/camera info (photographers).

> Creating, updating, or deleting a service or its detail rows requires a
> provider JWT (**POST/PUT/DELETE** are protected; the owning provider is
> taken from the token, not the request body).

---

### Wedding Plan & Shared Workspace

#### Create Wedding Plan
- **Path:** `/api/wedding-plans/`
- **Method:** `POST`
- **Auth:** Required
- **Input:**
```json
{
  "plan_name": "Our Wedding",
  "event_date": "2026-10-15",
  "budget": 80000,
  "notes": "Outdoor ceremony"
}
```
- **Output (201 Created):**
```json
{
  "success": true,
  "message": "Wedding plan created successfully.",
  "data": { "plan_id": 7, "plan_name": "Our Wedding", "status": "PLANNING" }
}
```

#### List My Wedding Plans
- **Path:** `/api/wedding-plans/me`
- **Method:** `GET`
- **Auth:** Required

#### Add Service to Plan
- **Path:** `/api/wedding-plan-selections/`
- **Method:** `POST`
- **Auth:** Required
- **Input:**
```json
{
  "plan_id": 7,
  "service_id": 105,
  "estimated_price": 18000,
  "notes": "First choice"
}
```
- **Behavior:** if the plan has a partner, the selection starts as
  `PENDING` and waits for partner approval; a solo plan auto-approves it
  as `APPROVED`.
- **Output (201 Created):**
```json
{
  "success": true,
  "message": "Service added to wedding plan successfully.",
  "data": { "plan_service_id": 31, "status": "PENDING" }
}
```

#### Approve / Reject a Selection (partner decision)
- **Path:** `/api/wedding-plan-selections/{id}/approve`
      · `/api/wedding-plan-selections/{id}/reject`
- **Method:** `POST`
- **Auth:** Required (must be a member of the plan)
- **Output (200 OK):** the selection with its new `status`
  (`APPROVED` / `REJECTED`).

---

### Wedding Plan Invitations

#### Invite a Partner
- **Path:** `/api/wedding-plan-invitations/`
- **Method:** `POST`
- **Auth:** Required
- **Input:**
```json
{
  "plan_id": 7,
  "invited_email": "partner@example.com"
}
```
- **Output (201 Created):** an invitation with a generated `invite_code`.

#### Accept / Reject an Invitation
- **Path:** `/api/wedding-plan-invitations/accept`
      · `/api/wedding-plan-invitations/reject`
- **Method:** `POST`
- **Auth:** Required (accept sets the caller as the plan's partner)
- **Input:**
```json
{ "invite_code": "aB3xY7..." }
```
- **Error (400):** invitation not found, already used, or expired.

---

### Bookings

#### Create Booking
- **Path:** `/api/bookings/`
- **Method:** `POST`
- **Auth:** Required (customer; the customer is taken from the token)
- **Input:**
```json
{
  "event_date": "2026-10-15",
  "notes": "Evening event",
  "items": [
    { "service_id": 105, "quantity": 1, "price_at_booking": "18000.00" }
  ]
}
```
- **Output (201 Created):**
```json
{
  "success": true,
  "message": "Booking created successfully.",
  "data": {
    "booking_id": 99,
    "event_date": "2026-10-15",
    "status": "PENDING",
    "total_price": "18000.00",
    "items": [
      { "booking_item_id": 1, "service_id": 105, "quantity": 1, "price_at_booking": "18000.00" }
    ]
  }
}
```

#### Update Booking Status (provider accepts / rejects)
- **Path:** `/api/bookings/{id}/status`
- **Method:** `POST`
- **Auth:** Required (the provider who owns the booked service)
- **Input:**
```json
{ "status": "CONFIRMED" }
```
- **Allowed values:** `CONFIRMED` or `REJECTED`.
- **Output (200 OK):** the booking with its updated `status`.

#### List My Bookings
- **Customer:** `GET /api/bookings/customer/me`
- **Provider:** `GET /api/bookings/provider/me`
- **Auth:** Required

---

### Favorites

#### Add to Favorites
- **Path:** `/api/favorites/`
- **Method:** `POST`
- **Auth:** Required
- **Input:**
```json
{ "service_id": 105 }
```
- **Output (201 Created):**
```json
{ "success": true, "message": "Added to favorites.", "data": { "favorite_id": 22 } }
```

#### List My Favorites
- **Path:** `/api/favorites/`
- **Method:** `GET`
- **Auth:** Required

#### Remove from Favorites
- **Path:** `/api/favorites/{service_id}`
- **Method:** `DELETE`
- **Auth:** Required

---

## 3. Technical Notes

- **Security:** protected endpoints require a valid JWT in the
  `Authorization` header. For provider actions, ownership is derived from
  the token (not from the request body), so a client cannot act on behalf
  of another provider.
- **Consistency:** every response uses the same envelope —
  `success`, `message`, and `data` (or `errors` on failure).
- **Prices** are returned as strings (e.g. `"18000.00"`) to avoid floating
  point rounding.

### Deviations from the original Stage 3 plan

| Planned | Implemented | Reason |
|---|---|---|
| `/api/v1/...` versioned paths | `/api/...` | Versioning deferred; a single API version is enough for the MVP. |
| `status` envelope field | `success` (boolean) | Simpler, unambiguous success flag. |
| `PATCH /bookings/{id}` | `POST /bookings/{id}/status` | A dedicated status action was clearer than a generic patch. |
| List pagination (`meta`, `page`, `limit`) | Full lists | Data volumes are small in the MVP; pagination is planned for later. |
| Partner approval on the **booking** | Approval on the **plan selection** | Collaboration happens during planning; the final booking is an individual action. |
| Moyasar / Google Maps / Cloudinary | Not integrated | Out of MVP scope; images use direct URLs for now. |
