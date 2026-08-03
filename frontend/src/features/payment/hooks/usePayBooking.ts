import { useCallback, useState } from 'react';

import { createMoyasarPayment, type CardDetails } from '@/services/moyasar/createPayment';
import {
  DEMO_PAYMENT_PREFIX,
  PENDING_PAYMENT_BOOKING_ID_KEY,
} from '@/features/payment/constants';
import { ROUTES } from '@/constants/routes';

export function usePayBooking(bookingId: number) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payNow = useCallback(
    async (amount: number, description: string, card: CardDetails) => {
      setError(null);
      setIsSubmitting(true);
      try {
        const amountInHalalas = Math.round(amount * 100);
        const callbackPath = ROUTES.PAYMENT_CALLBACK(bookingId);
        const callbackUrl = `${window.location.origin}${callbackPath}`;

        sessionStorage.setItem(PENDING_PAYMENT_BOOKING_ID_KEY, String(bookingId));

        const payment = await createMoyasarPayment(amountInHalalas, description, callbackUrl, card);

        if (payment.source.transaction_url) {
          window.location.href = payment.source.transaction_url;
          return;
        }

        // No 3D Secure challenge needed - go straight to the callback page
        // with what we already have.
        window.location.href = `${callbackPath}?id=${payment.id}&status=${payment.status}`;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'تعذر بدء عملية الدفع.');
        setIsSubmitting(false);
      }
    },
    [bookingId],
  );

  /**
   * Skips the gateway entirely and lands on the same callback page a real
   * payment would. The backend still decides whether to accept it (it only
   * does when PAYMENT_DEMO_MODE is on), and it takes the amount from the
   * booking, not from here.
   */
  const payAsDemo = useCallback(() => {
    setError(null);
    setIsSubmitting(true);
    sessionStorage.setItem(PENDING_PAYMENT_BOOKING_ID_KEY, String(bookingId));

    const demoPaymentId = `${DEMO_PAYMENT_PREFIX}${bookingId}_${Date.now()}`;
    window.location.href =
      `${ROUTES.PAYMENT_CALLBACK(bookingId)}?id=${demoPaymentId}&status=paid`;
  }, [bookingId]);

  return { payNow, payAsDemo, isSubmitting, error };
}
