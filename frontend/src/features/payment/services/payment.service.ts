import { paymentEndpoints } from '@/services/api/endpoints';
import type { PaymentRecord } from '@/features/payment/types';

export const paymentService = {
  async confirm(bookingId: number, gatewayPaymentId: string): Promise<PaymentRecord> {
    const { data } = await paymentEndpoints.confirm({
      booking_id: bookingId,
      gateway_payment_id: gatewayPaymentId,
    });
    return data.data;
  },

  async listByBooking(bookingId: number): Promise<PaymentRecord[]> {
    const { data } = await paymentEndpoints.byBooking(bookingId);
    return data.data;
  },
};
