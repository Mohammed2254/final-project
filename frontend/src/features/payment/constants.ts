/**
 * Moyasar redirects back with our own query params preserved alongside its
 * own (?id=...&status=...), but that's the gateway's behavior, not ours to
 * guarantee - sessionStorage is a fallback the callback page also checks,
 * in case a query param gets dropped somewhere along the 3DS redirect.
 */
export const PENDING_PAYMENT_BOOKING_ID_KEY = 'farah.pendingPaymentBookingId';
