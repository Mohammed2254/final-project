export interface PaymentConfirmPayload {
  booking_id: number;
  gateway_payment_id: string;
}

export type PaymentStatus = 'initiated' | 'paid' | 'failed';

export interface PaymentRecord {
  payment_id: number;
  booking_id: number;
  amount: string;
  currency: string;
  status: PaymentStatus;
  gateway_payment_id: string;
  paid_at: string | null;
  created_at: string;
}
