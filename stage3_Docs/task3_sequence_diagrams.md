# Sequence Diagrams — Farah

> Four key use cases. Facade + Repository pattern, MySQL database.
> Each diagram shows the success path and the main error path.

---

## Diagram 1 — Partner Joins a Shared Wedding Plan

```mermaid
sequenceDiagram
    actor Partner as Partner (Auth User)
    participant React as Frontend
    participant Facade as Workspace Facade
    participant Repo as Plan Repository
    participant DB as MySQL Database

    Partner->>React: Enter invitation code and join
    React->>Facade: POST /api/workspace/join {code} + Token

    Facade->>Repo: validateInvitation(code)
    Repo->>DB: SELECT * FROM WEDDING_PLAN_INVITATION WHERE code=X AND status="ACTIVE"

    alt Invitation valid
        DB-->>Repo: Invitation details (PlanID)

        Note over Repo, DB: Begin Database Transaction
        Facade->>Repo: executeJoinProcess(PlanID, PartnerID, code)
        Repo->>DB: UPDATE WEDDING_PLAN SET PartnerID = PartnerID
        Repo->>DB: UPDATE WEDDING_PLAN_INVITATION SET status = "USED"
        Note over Repo, DB: Commit Transaction

        Repo-->>Facade: Success
        Facade-->>React: 200 OK
        React-->>Partner: Redirect to shared workspace

    else Invitation invalid or expired
        DB-->>Repo: No results
        Repo-->>Facade: Error
        Facade-->>React: 404 Not Found
        React-->>Partner: Show "Invalid or expired code" message
    end
```

---

## Diagram 2 — Browse Halls with Filters and Pagination

```mermaid
sequenceDiagram
    actor User as User
    participant React as Frontend
    participant Facade as Catalog Facade
    participant Repo as Service Repository
    participant DB as MySQL Database

    User->>React: Set filters and search
    React->>Facade: GET /api/services/halls?city=X&page=1&limit=10

    Facade->>Repo: fetchHalls(city, page, limit)
    Repo->>DB: SELECT * FROM SERVICE JOIN HALL_DETAILS ... LIMIT 10 OFFSET 0

    alt Results found
        DB-->>Repo: List of 10 halls + total count
        Repo-->>Facade: Result object
        Facade-->>React: 200 OK { data: [...], meta: {total: 50, page: 1} }
        React-->>User: Display first 10 halls

    else No results
        DB-->>Repo: Empty list
        Repo-->>Facade: Empty result
        Facade-->>React: 200 OK { data: [], meta: {total: 0, page: 1} }
        React-->>User: Show "No halls match your filters"
    end
```

---

## Diagram 3 — Add a Service to the Workspace

```mermaid
sequenceDiagram
    actor User as User (Owner / Partner)
    participant React as Frontend
    participant Facade as Workspace Facade
    participant Repo as PlanService Repository
    participant DB as MySQL Database

    User->>React: Click "Add to workspace"
    React->>Facade: POST /api/workspace/services {serviceId, planId}

    Facade->>Repo: isServiceValid(serviceId)
    Repo->>DB: SELECT id FROM SERVICE WHERE id = serviceId

    alt Service exists
        DB-->>Repo: True

        Facade->>Repo: checkIfAlreadyAdded(planId, serviceId)
        Repo->>DB: SELECT count(*) FROM WEDDING_PLAN_SERVICE WHERE ...

        alt Not already added
            DB-->>Repo: Count = 0
            Facade->>Repo: addServiceToPlan(planId, serviceId)
            Repo->>DB: INSERT INTO WEDDING_PLAN_SERVICE ...
            Repo-->>Facade: Success
            Facade-->>React: 201 Created
            React-->>User: Show success message

        else Already added
            DB-->>Repo: Count > 0
            Repo-->>Facade: Duplicate
            Facade-->>React: 409 Conflict
            React-->>User: Show "Service already in your plan"
        end

    else Service not found
        DB-->>Repo: No results
        Repo-->>Facade: Error
        Facade-->>React: 404 Not Found
        React-->>User: Show "Service not available"
    end
```

---

## Diagram 4 — Confirm a Booking with Partner Approval

```mermaid
sequenceDiagram
    actor User as User
    participant React as Frontend
    participant Facade as Booking Facade
    participant Repo as Booking Repository
    participant DB as MySQL Database

    User->>React: Click "Approve booking"
    React->>Facade: POST /api/workspace/book {planId, serviceId}

    Facade->>Repo: checkAvailability(serviceId, weddingDate)
    Repo->>DB: SELECT count(*) FROM BOOKING WHERE ...

    alt Service available
        DB-->>Repo: Available

        Facade->>Repo: checkPartnerApproval(planId)
        Repo->>DB: SELECT PartnerApproved FROM WEDDING_PLAN_SERVICE

        alt Partner approved (or no partner)
            DB-->>Repo: True
            Facade->>Repo: confirmBooking(planId, serviceId)
            Repo->>DB: UPDATE WEDDING_PLAN_SERVICE SET Status = 'BOOKED'
            Facade-->>React: 200 OK (Booking confirmed)
            React-->>User: Show "Booking confirmed"

        else Waiting for partner
            DB-->>Repo: False
            Facade->>Repo: setPending()
            Repo->>DB: UPDATE WEDDING_PLAN_SERVICE SET Status = 'WAITING_PARTNER'
            Facade-->>React: 200 OK (Waiting for partner)
            React-->>User: Show "Waiting for partner approval"
        end

    else Service not available
        DB-->>Repo: Not available
        Repo-->>Facade: Error
        Facade-->>React: 409 Conflict
        React-->>User: Show "Service not available on this date"
    end
```