# System Architecture — Farah

High-level architecture showing how the system components interact and how data flows between them.

```mermaid
flowchart TD
    %% Actors
    User["User & Partner"]
    Vendor["Vendor"]

    %% Presentation Layer
    subgraph Presentation["Presentation Layer"]
        React["React Web Application"]
    end

    %% Application Layer
    subgraph Application["Application Layer — Flask Backend"]
        Auth["Auth Module<br/>Register · Login · JWT"]
        Catalog["Catalog Module<br/>Browse Services & Vendors"]
        Booking["Booking & Workspace Module<br/>Plan · Add · Approve · Book"]
    end

    %% Data Layer
    subgraph Data["Data Layer"]
        DB[("MySQL Relational Database")]
    end

    %% External Services
    subgraph External["External Services"]
        Moyasar["Moyasar<br/>Payment (Sandbox)"]
        Maps["Google Maps<br/>Locations"]
        Cloudinary["Cloudinary<br/>Media"]
    end

    %% Actor flows
    User -->|"Auth, Browse, Plan, Book"| React
    Vendor -->|"Auth, Manage Profile & Services"| React

    %% Presentation to Application
    React -->|"HTTPS / JSON · Bearer JWT"| Auth
    React -->|"HTTPS / JSON · Bearer JWT"| Catalog
    React -->|"HTTPS / JSON · Bearer JWT"| Booking

    %% Application to Data
    Auth -->|"SQLAlchemy ORM"| DB
    Catalog -->|"SQLAlchemy ORM"| DB
    Booking -->|"SQLAlchemy ORM"| DB

    %% Application to External
    Booking -.->|"API"| Moyasar
    Catalog -.->|"API"| Maps
    Catalog -.->|"API"| Cloudinary
```

## Layer Responsibilities

**Presentation Layer (React):** Renders all user and vendor interfaces. Sends authenticated requests to the backend over HTTPS using JWT tokens. Holds no business logic.

**Application Layer (Flask):** Contains all business logic, split into three modules — Auth (registration, login, token handling), Catalog (browsing services and vendors), and Booking & Workspace (wedding plans, shared decisions, bookings). Communicates with the database through SQLAlchemy ORM and calls external services when needed.

**Data Layer (MySQL):** Persists all application data — accounts, services, plans, bookings, and favorites.

**External Services:** Moyasar handles payment in sandbox mode, Google Maps provides venue locations, and Cloudinary hosts and optimizes media files.