/**
 * Moyasar redirects back with our own query params preserved alongside its
 * own (?id=...&status=...), but that's the gateway's behavior, not ours to
 * guarantee - sessionStorage is a fallback the callback page also checks,
 * in case a query param gets dropped somewhere along the 3DS redirect.
 */
export const PENDING_PAYMENT_BOOKING_ID_KEY = 'farah.pendingPaymentBookingId';

/**
 * Shows a "complete the payment as a demo" button. Must match
 * PAYMENT_DEMO_MODE on the backend - this flag only reveals the button, the
 * backend is what decides whether the demo payment is accepted.
 */
export const PAYMENT_DEMO_MODE =
  (import.meta.env.VITE_PAYMENT_DEMO_MODE as string | undefined) === 'true';

/** Backend only takes the demo path for ids carrying this prefix. */
export const DEMO_PAYMENT_PREFIX = 'demo_';
