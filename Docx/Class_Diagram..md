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

class Account {
+int accountId
+string email
+string passwordHash
+string role
+DateTime createdAt
+register()
+login()
+validateCredentials()
}

class UserProfile {
+int userProfileId
+int accountId
+string fullName
+updateProfile()
+viewWeddingPlan()
}

class ServiceProviderProfile {
+int providerProfileId
+int accountId
+string businessName
+string description
+string phoneNumber
+string logoPath
+createService()
+updateService()
+viewBookingRequests()
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
+DateTime createdAt
+createService()
+updateService()
+deactivateService()
+getServiceDetails()
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
+updateHallDetails()
}

class EquipmentType {
+int equipmentTypeId
+string equipmentName
}

class ServiceEquipment {
+int serviceEquipmentId
+int serviceId
+int equipmentTypeId
+assignEquipment()
+removeEquipment()
}

class ServiceMedia {
+int mediaId
+int serviceId
+string filePath
+bool isPrimary
+DateTime uploadedAt
+uploadMedia()
+deleteMedia()
+setPrimary()
}

class WeddingPlan {
+int weddingPlanId
+int ownerUserId
+int partnerUserId
+string planName
+Date weddingDate
+decimal budget
+DateTime createdAt
+createPlan()
+updatePlan()
+invitePartner()
+addServiceToPlan()
}

class WeddingPlanInvitation {
+int invitationId
+int weddingPlanId
+string invitationCode
+int requestedByUserId
+string status
+DateTime createdAt
+DateTime respondedAt
+generateCode()
+requestJoin()
+approve()
+reject()
}

class WeddingPlanService {
+int weddingPlanServiceId
+int weddingPlanId
+int serviceId
+int addedByUserId
+string status
+DateTime addedAt
+markInterested()
+markSelected()
+removeFromPlan()
}

class Booking {
+int bookingId
+int weddingPlanId
+int createdByUserId
+Date bookingDate
+string notes
+string status
+decimal totalPriceAtBooking
+DateTime createdAt
+createBooking()
+cancelBooking()
+calculateTotal()
+updateStatus()
}

class BookingItem {
+int bookingItemId
+int bookingId
+int serviceId
+decimal priceAtBooking
+string status
+string rejectionReason
+DateTime respondedAt
+acceptItem()
+rejectItem()
+cancelItem()
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
+DateTime paidAt
+DateTime createdAt
+DateTime updatedAt
+string rawResponse
+createPayment()
+confirmPayment()
+updatePaymentStatus()
}

class Favorite {
+int favoriteId
+int userId
+int serviceId
+DateTime createdAt
+addFavorite()
+removeFavorite()
}

Account "1" _-- "0..1" UserProfile : customer_profile
Account "1" _-- "0..1" ServiceProviderProfile : provider_profile

Service "1" _-- "0..1" HallDetails : hall_details
Service "1" _-- "0.._" ServiceMedia : media
Service "1" _-- "0..\*" ServiceEquipment : equipment

WeddingPlan "1" _-- "0.._" WeddingPlanInvitation : invitations
WeddingPlan "1" _-- "0.._" WeddingPlanService : selected_services
WeddingPlan "1" _-- "0.._" Booking : bookings

Booking "1" _-- "1.._" BookingItem : booking_items
Booking "1" _-- "0.._" Payment : payments

ServiceProviderProfile "1" --> "0.._" Service : owns
ServiceCategory "1" --> "0.._" Service : classifies
EquipmentType "1" --> "0..\*" ServiceEquipment : type

UserProfile "1" --> "0..1" WeddingPlan : owns
UserProfile "1" --> "0..1" WeddingPlan : partner_in
UserProfile "1" --> "0.._" WeddingPlanInvitation : requested_by
UserProfile "1" --> "0.._" WeddingPlanService : added_by
UserProfile "1" --> "0.._" Booking : created_by
UserProfile "1" --> "0.._" Payment : paid_by
UserProfile "1" --> "0..\*" Favorite : saves

Service "1" --> "0.._" WeddingPlanService : selected
Service "1" --> "0.._" BookingItem : requested_service
Service "1" --> "0..\*" Favorite : favorited
