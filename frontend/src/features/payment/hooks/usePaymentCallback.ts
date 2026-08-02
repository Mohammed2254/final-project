import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { paymentService } from '@/features/payment/services/payment.service';
import { PENDING_PAYMENT_BOOKING_ID_KEY } from '@/features/payment/constants';
import { ApiException } from '@/types/api';

type CallbackStatus = 'confirming' | 'success' | 'error';

export function usePaymentCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<CallbackStatus>('confirming');
  const [error, setError] = useState<string | null>(null);

  const confirm = useCallback(async () => {
    const gatewayPaymentId = searchParams.get('id');
    const bookingIdParam =
      searchParams.get('booking_id') ?? sessionStorage.getItem(PENDING_PAYMENT_BOOKING_ID_KEY);

    if (!gatewayPaymentId || !bookingIdParam) {
      setStatus('error');
      setError('رابط الدفع غير مكتمل أو غير صالح.');
      return;
    }

    try {
      await paymentService.confirm(Number(bookingIdParam), gatewayPaymentId);
      sessionStorage.removeItem(PENDING_PAYMENT_BOOKING_ID_KEY);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof ApiException ? err.message : 'تعذر تأكيد عملية الدفع.');
    }
  }, [searchParams]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    confirm();
  }, [confirm]);

  return { status, error };
}
