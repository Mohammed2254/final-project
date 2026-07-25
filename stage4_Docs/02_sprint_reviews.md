# Stage 4 — Sprint Reviews

Reviews were conducted primarily through our **weekly mentor sessions**
(6 total across the project), where we demoed current progress and
received feedback that shaped the next sprint's priorities. Internal
progress was also reviewed informally in near-daily team check-ins.

## Sprint 1 Review — Backend Foundation

**Demoed:** Account registration/login via Postman, layered backend
structure (routes/services/repositories/models) for the `Account` and
`Service` resources.

**Outcome:** Foundation approved; team proceeded to build outward from
this pattern for every subsequent resource.

## Sprint 2 Review — Core Catalog & Booking

**Demoed:** Browsable halls/photographers on the frontend fetching real
data from the backend; ability to create a booking with multiple items.

**Outcome:** Core user journey (browse → book) confirmed working
end-to-end for the first time.

## Sprint 3 Review — Shared Wedding Planning

**Demoed:** The platform's key differentiator — a couple creating a
shared wedding plan, inviting a partner by code, and both members
approving service selections together.

**Outcome:** The feature that distinguishes Farah from a generic
booking site was functional and demoed successfully.

## Sprint 4 Review — Production Readiness

**Demoed:**
- Full test suite passing (11/11).
- Live production deployment: **https://farah-592g.onrender.com**
- Security fix walkthrough: unauthenticated requests correctly rejected
  (401) on protected endpoints.

**Outcome:** MVP considered feature-complete and live for evaluation.

## Honest note

We do not have formal written minutes for every mentor session — this
document summarizes what was demoed based on the state of the codebase
at each point in time (verifiable via Git history) rather than
transcribing meetings we did not record in writing.
