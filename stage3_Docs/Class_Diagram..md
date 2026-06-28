# Class Diagram Design

## Wedding Planning Platform

---

# Overview

This document describes the object-oriented design of the Wedding Planning Platform backend. It defines the main classes, their responsibilities, relationships, and the reasoning behind the architectural decisions.

Unlike the Entity Relationship Diagram (ERD), which represents the database schema, the Class Diagram represents the software structure and interaction between objects inside the application.

The backend follows an object-oriented layered architecture using Python and SQLAlchemy.

---

# Design Goals

The class model was designed to achieve the following goals:

- High maintainability
- Low coupling
- High cohesion
- Easy extensibility
- Clear separation of responsibilities
- Reusable business objects
- Future scalability

---

# Design Principles

The design follows several software engineering principles.

## Layered Architecture

The backend is divided into independent layers.

```text
Client

↓

Routes

↓

Services

↓

Repositories

↓

Models

↓

Database
```

Each layer has a single responsibility.

---

## Single Responsibility Principle (SRP)

Every class has only one responsibility.

Examples:

- Account manages authentication information.
- Booking manages booking information.
- Payment manages payment information.
- WeddingPlan manages planning information.

---

## Composition

Composition is used when one object cannot logically exist without another.

Examples:

- Booking owns BookingItems.
- Booking owns Payments.
- WeddingPlan owns Bookings.
- WeddingPlan owns Selected Services.
- Service owns Media.
- Service owns Hall Details.

If the parent object is removed, its composed objects are also removed.

---

## Association

Association is used when objects collaborate but have independent lifecycles.

Examples:

- UserProfile creates Bookings.
- Provider owns Services.
- Service belongs to Category.
- User saves Favorite services.

---

## Extensibility

The design allows new service categories without changing the core architecture.

Examples:

- Catering
- Wedding Organizer
- Makeup Artist
- Entertainment
- Transportation
- Flower Decoration

These can be introduced by creating new categories while reusing the existing Service model.

---

classDiagram

```mermaid
classDiagram
class Account {
  +int accountId
  +string email
  +string passwordHash
  +string role
  +datetime createdAt
}

class UserProfile {
  +int userProfileId
  +int accountId
  +string fullName
}

class ServiceProviderProfile {
  +int providerProfileId
  +int accountId
  +string businessName
  +string description
  +string phoneNumber
  +string logoPath
}

class ServiceCategory {
  +int categoryId
  +string categoryName
  +string description
}

class Service {
  +int serviceId
  +int providerProfileId
  +int categoryId
  +string serviceName
  +string description
  +decimal price
  +bool isActive
  +datetime createdAt
}

class HallDetails {
  +int hallDetailsId
  +int serviceId
  +int minCapacity
  +int maxCapacity
  +string city
  +string address
  +decimal latitude
  +decimal longitude
}

class EquipmentType {
  +int equipmentTypeId
  +string equipmentName
}

class ServiceEquipment {
  +int serviceEquipmentId
  +int serviceId
  +int equipmentTypeId
}

class ServiceMedia {
  +int mediaId
  +int serviceId
  +string filePath
  +bool isPrimary
  +datetime uploadedAt
}

class WeddingPlan {
  +int weddingPlanId
  +int ownerUserId
  +int partnerUserId
  +string planName
  +date weddingDate
  +decimal budget
  +datetime createdAt
}

class WeddingPlanInvitation {
  +int invitationId
  +int weddingPlanId
  +string invitationCode
  +int requestedByUserId
  +string status
  +datetime createdAt
  +datetime respondedAt
}

class WeddingPlanService {
  +int weddingPlanServiceId
  +int weddingPlanId
  +int serviceId
  +int addedByUserId
  +string status
  +datetime addedAt
}

class Booking {
  +int bookingId
  +int weddingPlanId
  +int createdByUserId
  +date bookingDate
  +string notes
  +string status
  +decimal totalPriceAtBooking
  +datetime createdAt
}

class BookingItem {
  +int bookingItemId
  +int bookingId
  +int serviceId
  +decimal priceAtBooking
  +string status
  +string rejectionReason
  +datetime respondedAt
}

class Payment {
  +int paymentId
  +int bookingId
  +int paidByUserId
  +decimal amount
  +string currency
  +string paymentGateway
  +string gatewayPaymentId
  +string gatewayTransactionId
  +string gatewayReferenceNumber
  +string paymentMethod
  +string status
  +datetime paidAt
  +datetime createdAt
  +datetime updatedAt
  +string rawResponse
}

class Favorite {
  +int favoriteId
  +int userId
  +int serviceId
  +datetime createdAt
}

Account "1" *-- "0..1" UserProfile
Account "1" *-- "0..1" ServiceProviderProfile

ServiceProviderProfile "1" --> "0..*" Service
ServiceCategory "1" --> "0..*" Service

Service "1" *-- "0..1" HallDetails
Service "1" *-- "0..*" ServiceMedia
Service "1" *-- "0..*" ServiceEquipment
EquipmentType "1" --> "0..*" ServiceEquipment

WeddingPlan "1" *-- "0..*" WeddingPlanInvitation
WeddingPlan "1" *-- "0..*" WeddingPlanService
WeddingPlan "1" *-- "0..*" Booking

Booking "1" *-- "1..*" BookingItem
Booking "1" *-- "0..*" Payment

UserProfile "1" --> "0..1" WeddingPlan
UserProfile "1" --> "0..*" WeddingPlanInvitation
UserProfile "1" --> "0..*" WeddingPlanService
UserProfile "1" --> "0..*" Booking
UserProfile "1" --> "0..*" Payment
UserProfile "1" --> "0..*" Favorite

Service "1" --> "0..*" WeddingPlanService
Service "1" --> "0..*" BookingItem
Service "1" --> "0..*" Favorite
```
