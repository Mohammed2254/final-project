# Database Design

## Wedding Planning Platform

## Overview

This document describes the relational database design of the Wedding Planning Platform. It explains the purpose of each table, its relationships with other tables, and the design decisions behind the database.

The database is designed using a normalized relational model to ensure data consistency, reduce redundancy, and support future scalability.

---

# Database Design Principles

The database was designed according to the following principles:

- Normalize data to reduce duplication.
- Separate business entities into independent tables.
- Use foreign keys to maintain referential integrity.
- Support future expansion by keeping the design modular.
- Store payment gateway responses without storing sensitive payment information.

---

# Entity Relationship Diagram (ERD)

```mermaid
erDiagram

    ACCOUNT {

        int AccountID PK

        string Email UK

        string PasswordHash

        string Role

        datetime CreatedAt

    }

    USER_PROFILE {

        int UserProfileID PK

        int AccountID FK

        string FullName

    }

    SERVICE_PROVIDER_PROFILE {

        int ProviderProfileID PK

        int AccountID FK

        string BusinessName

        string Description

        string PhoneNumber

        string LogoPath

    }

    SERVICE_CATEGORY {

        int CategoryID PK

        string CategoryName

        string Description

    }

    SERVICE {

        int ServiceID PK

        int ProviderProfileID FK

        int CategoryID FK

        string ServiceName

        string Description

        decimal Price

        bool IsActive

        datetime CreatedAt

    }

    HALL_DETAILS {

        int HallDetailsID PK

        int ServiceID FK

        int MinCapacity

        int MaxCapacity

        string City

        string Address

        decimal Latitude

        decimal Longitude

    }

    EQUIPMENT_TYPE {

        int EquipmentTypeID PK

        string EquipmentName

    }

    SERVICE_EQUIPMENT {

        int ServiceEquipmentID PK

        int ServiceID FK

        int EquipmentTypeID FK

    }

    SERVICE_MEDIA {

        int MediaID PK

        int ServiceID FK

        string FilePath

        bool IsPrimary

        datetime UploadedAt

    }

    WEDDING_PLAN {

        int WeddingPlanID PK

        int OwnerUserID FK

        int PartnerUserID FK

        string PlanName

        date WeddingDate

        decimal Budget

        datetime CreatedAt

    }

    WEDDING_PLAN_INVITATION {

        int InvitationID PK

        int WeddingPlanID FK

        string InvitationCode

        int RequestedByUserID FK

        string Status

        datetime CreatedAt

        datetime RespondedAt

    }

    WEDDING_PLAN_SERVICE {

        int WeddingPlanServiceID PK

        int WeddingPlanID FK

        int ServiceID FK

        int AddedByUserID FK

        string Status

        datetime AddedAt

    }

    BOOKING {

        int BookingID PK

        int WeddingPlanID FK

        int CreatedByUserID FK

        date BookingDate

        string Notes

        string Status

        decimal TotalPriceAtBooking

        datetime CreatedAt

    }

    BOOKING_ITEM {

        int BookingItemID PK

        int BookingID FK

        int ServiceID FK

        decimal PriceAtBooking

        string Status

        string RejectionReason

        datetime RespondedAt

    }

    PAYMENT {

        int PaymentID PK

        int BookingID FK

        int PaidByUserID FK

        decimal Amount

        string Currency

        string PaymentGateway

        string GatewayPaymentID

        string GatewayTransactionID

        string GatewayReferenceNumber

        string PaymentMethod

        string Status

        datetime PaidAt

        datetime CreatedAt

        datetime UpdatedAt

        string RawResponse

    }

    FAVORITE {

        int FavoriteID PK

        int UserID FK

        int ServiceID FK

        datetime CreatedAt

    }

    ACCOUNT ||--o| USER_PROFILE : customer_profile
    ACCOUNT ||--o| SERVICE_PROVIDER_PROFILE : provider_profile
    SERVICE_PROVIDER_PROFILE ||--o{ SERVICE : owns
    SERVICE_CATEGORY ||--o{ SERVICE : classifies
    SERVICE ||--o| HALL_DETAILS : hall_details
    SERVICE ||--o{ SERVICE_EQUIPMENT : equipment
    EQUIPMENT_TYPE ||--o{ SERVICE_EQUIPMENT : type
    SERVICE ||--o{ SERVICE_MEDIA : media
    USER_PROFILE ||--o| WEDDING_PLAN : owner
    USER_PROFILE ||--o| WEDDING_PLAN : partner
    WEDDING_PLAN ||--o{ WEDDING_PLAN_INVITATION : invitations
    USER_PROFILE ||--o{ WEDDING_PLAN_INVITATION : requester
    WEDDING_PLAN ||--o{ WEDDING_PLAN_SERVICE : selected_services
    SERVICE ||--o{ WEDDING_PLAN_SERVICE : selected
    USER_PROFILE ||--o{ WEDDING_PLAN_SERVICE : added_by
    WEDDING_PLAN ||--o{ BOOKING : bookings
    USER_PROFILE ||--o{ BOOKING : created_by
    BOOKING ||--|{ BOOKING_ITEM : contains
    SERVICE ||--o{ BOOKING_ITEM : requested_service
    BOOKING ||--o{ PAYMENT : payments
    USER_PROFILE ||--o{ PAYMENT : paid_by
    USER_PROFILE ||--o{ FAVORITE : favorites
    SERVICE ||--o{ FAVORITE : saved_service
```

---

# Table Descriptions

## ACCOUNT

Stores authentication information for all users. Every account belongs to exactly one customer profile or one service provider profile.

---

## USER_PROFILE

Stores customer information such as the customer's full name. Customers create wedding plans, bookings, payments, and favorites.

---

## SERVICE_PROVIDER_PROFILE

Stores business information for service providers. Each provider can create and manage multiple services.

---

## SERVICE_CATEGORY

Stores available service categories (Hall, Photographer, Makeup Artist, etc.). This design makes the system extensible without changing the database schema.

---

## SERVICE

Represents a wedding service offered by a provider. Common service information is stored here regardless of service type.

---

## HALL_DETAILS

Stores hall-specific information such as capacity and location. It exists only for services categorized as halls.

---

## EQUIPMENT_TYPE

Stores available photography equipment types.

---

## SERVICE_EQUIPMENT

Implements the many-to-many relationship between photography services and equipment types.

---

## SERVICE_MEDIA

Stores images and media associated with each service. Media files are stored on the server, while the database stores only their paths.

---

## WEDDING_PLAN

Represents the customer's wedding planning workspace, including wedding date, budget, owner, and optional partner.

---

## WEDDING_PLAN_INVITATION

Stores collaboration invitations between partners.

---

## WEDDING_PLAN_SERVICE

Stores all services selected during the planning stage before booking.

---

## BOOKING

Represents a booking transaction created from a wedding plan. A single booking may contain multiple requested services.

---

## BOOKING_ITEM

Represents each requested service inside a booking. Providers can independently accept or reject their booking items.

---

## PAYMENT

Stores payment information and payment gateway responses. Sensitive card information is never stored.

---

## FAVORITE

Allows customers to save services for future reference without affecting bookings or wedding plans.

---

# Database Relationships

- One Account owns one Customer Profile or one Provider Profile.
- One Provider can own multiple Services.
- One Service belongs to one Category.
- One Wedding Plan contains multiple selected services.
- One Booking contains multiple Booking Items.
- One Booking can have multiple Payment records.
- Customers can save multiple Favorite services.

---

# Future Extensions

The current design supports future expansion without major schema changes. New service categories such as catering, flower decoration, entertainment, transportation, or wedding organizers can be added by inserting new records into the `SERVICE_CATEGORY` table while reusing the existing service architecture.
