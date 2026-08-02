import { useCallback, useState } from 'react';

import { createMoyasarPayment, type CardDetails } from '@/services/moyasar/createPayment';
import { PENDING_PAYMENT_BOOKING_ID_KEY } from '@/features/payment/constants';
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
        const callbackUrl =
          `${window.location.origin}${ROUTES.PAYMENT_CALLBACK}?booking_id=${bookingId}`;

        sessionStorage.setItem(PENDING_PAYMENT_BOOKING_ID_KEY, String(bookingId));

        const payment = await createMoyasarPayment(amountInHalalas, description, callbackUrl, card);

        if (payment.source.transaction_url) {
          window.location.href = payment.source.transaction_url;
          return;
        }

        // No 3D Secure challenge needed - go straight to the callback page
        // with what we already have.
        window.location.href =
          `${ROUTES.PAYMENT_CALLBACK}?booking_id=${bookingId}&id=${payment.id}&status=${payment.status}`;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'تعذر بدء عملية الدفع.');
        setIsSubmitting(false);
      }
    },
    [bookingId],
  );

  return { payNow, isSubmitting, error };
}
