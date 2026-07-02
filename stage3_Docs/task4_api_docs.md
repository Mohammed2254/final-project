# API Documentation — Farah

## 1. External APIs

| External API | Purpose | Rationale |
|---|---|---|
| **Moyasar API** | Payment processing for bookings and down payments | A leading Saudi payment gateway with a robust Sandbox environment, allowing us to simulate real transactions safely during development without real charges. |
| **Google Maps API** | Displaying exact locations of wedding halls and studios | Provides highly accurate location data and improves UX by letting couples visualize venues on a map instead of plain-text addresses. Offers a generous free tier suitable for development. |
| **Cloudinary API** | Hosting and optimizing media files (hall, service, and photographer images) | Storing high-resolution images directly in the database is an anti-pattern. Cloudinary lets us upload via API and store only optimized image URLs, reducing server load and bandwidth. |

> Note: Google Maps and Moyasar are used within their free / sandbox tiers, which are sufficient for the MVP and testing scope.

---

## 2. Internal API Endpoints

The system API follows RESTful principles with proper HTTP methods, `v1` versioning, and standardized JSON responses.

All protected endpoints require an `Authorization: Bearer <JWT_TOKEN>` header.

---

### Authentication

#### Register
- **Path:** `/api/v1/auth/register`
- **Method:** `POST`
- **Auth:** Not required
- **Input:**
```json
{
  "email": "user@example.com",
  "password": "StrongPass123",
  "full_name": "Mohammed Al-Abdali",
  "role": "USER"
}
```
- **Output (201 Created):**
```json
{
  "status": "success",
  "message": "Account created successfully.",
  "data": { "account_id": 12, "role": "USER" }
}
```

#### Login
- **Path:** `/api/v1/auth/login`
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
  "status": "success",
  "message": "Login successful.",
  "data": { "token": "<JWT_TOKEN>", "account_id": 12, "role": "USER" }
}
```

---

### Services (Halls & Photographers)

#### List Halls (with filters & pagination)
- **Path:** `/api/v1/services/halls`
- **Method:** `GET`
- **Auth:** Not required
- **Query Parameters:** `city`, `min_capacity`, `max_price`, `date`, `page`, `limit`
- **Example:** `/api/v1/services/halls?city=Riyadh&max_price=20000&page=1&limit=10`
- **Output (200 OK):**
```json
{
  "status": "success",
  "data": [
    { "service_id": 105, "name": "Royal Hall", "price": 18000, "capacity": 400, "city": "Riyadh" }
  ],
  "meta": { "total": 50, "page": 1, "limit": 10 }
}
```

#### List Photographers
- **Path:** `/api/v1/services/photographers`
- **Method:** `GET`
- **Auth:** Not required
- **Query Parameters:** `max_price`, `camera_type`, `page`, `limit`
- **Output (200 OK):** Same paginated structure as halls.

#### Get Service Details
- **Path:** `/api/v1/services/{id}`
- **Method:** `GET`
- **Auth:** Not required
- **Output (200 OK):**
```json
{
  "status": "success",
  "data": {
    "service_id": 105,
    "name": "Royal Hall",
    "description": "Luxury wedding venue in north Riyadh.",
    "price": 18000,
    "provider": { "business_name": "Royal Events", "phone": "+9665XXXXXXXX" },
    "media": ["https://res.cloudinary.com/.../hall1.jpg"]
  }
}
```

---

### Wedding Plan & Shared Workspace

#### Create Wedding Plan
- **Path:** `/api/v1/plans`
- **Method:** `POST`
- **Auth:** Required
- **Input:**
```json
{
  "plan_name": "Our Wedding",
  "wedding_date": "2026-10-15",
  "budget": 80000
}
```
- **Output (201 Created):**
```json
{
  "status": "success",
  "message": "Wedding plan created successfully.",
  "data": { "plan_id": 7, "status": "ACTIVE" }
}
```

#### Add Service to Plan
- **Path:** `/api/v1/workspace/services`
- **Method:** `POST`
- **Auth:** Required
- **Input:**
```json
{
  "plan_id": 7,
  "service_id": 105
}
```
- **Output (201 Created):**
```json
{
  "status": "success",
  "message": "Service added to your plan.",
  "data": { "plan_service_id": 31, "status": "INTERESTED" }
}
```
- **Error (409 Conflict):** Service already added to this plan.

#### Join Shared Plan via Invitation Code
- **Path:** `/api/v1/workspace/join`
- **Method:** `POST`
- **Auth:** Required
- **Input:**
```json
{
  "code": "FARAH-8X2K"
}
```
- **Output (200 OK):**
```json
{
  "status": "success",
  "message": "You have joined the shared wedding plan.",
  "data": { "plan_id": 7 }
}
```
- **Error (404 Not Found):** Invalid or expired invitation code.

---

### Bookings

#### Create Booking
- **Path:** `/api/v1/bookings`
- **Method:** `POST`
- **Auth:** Required
- **Input:**
```json
{
  "plan_id": 7,
  "service_id": 105,
  "booking_date": "2026-10-15"
}
```
- **Output (201 Created):**
```json
{
  "status": "success",
  "message": "Booking request created, awaiting partner approval.",
  "data": { "booking_id": 99, "status": "WAITING_PARTNER" }
}
```

#### Update Booking Status (Approve / Reject)
- **Path:** `/api/v1/bookings/{id}`
- **Method:** `PATCH`
- **Auth:** Required
- **Input:**
```json
{
  "status": "APPROVED"
}
```
- **Output (200 OK):**
```json
{
  "status": "success",
  "message": "Booking status updated successfully.",
  "data": { "booking_id": 99, "new_status": "APPROVED" }
}
```

#### List My Bookings
- **Path:** `/api/v1/bookings`
- **Method:** `GET`
- **Auth:** Required
- **Output (200 OK):**
```json
{
  "status": "success",
  "data": [
    { "booking_id": 99, "service_name": "Royal Hall", "booking_date": "2026-10-15", "status": "BOOKED" }
  ]
}
```

---

### Favorites

#### Add to Favorites
- **Path:** `/api/v1/favorites`
- **Method:** `POST`
- **Auth:** Required
- **Input:**
```json
{
  "service_id": 105
}
```
- **Output (201 Created):**
```json
{
  "status": "success",
  "message": "Added to favorites.",
  "data": { "favorite_id": 22 }
}
```

#### Remove from Favorites
- **Path:** `/api/v1/favorites/{id}`
- **Method:** `DELETE`
- **Auth:** Required
- **Output (200 OK):**
```json
{
  "status": "success",
  "message": "Removed from favorites."
}
```

---

## 3. Technical Notes

- **Security:** All protected endpoints require a valid JWT in the `Authorization` header.
- **Versioning:** The `v1` prefix ensures backward compatibility for future API versions.
- **Consistency:** Every response follows the same envelope — `status`, `message`, and `data`.
- **Idempotency:** `POST /bookings` supports a client-generated unique identifier to prevent duplicate submissions; `PATCH` updates only the target resource's state.