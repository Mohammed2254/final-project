import { MOYASAR_PUBLISHABLE_KEY } from '@/constants/moyasar';

export interface CardDetails {
  name: string;
  number: string;
  month: string;
  year: string;
  cvc: string;
}

export interface MoyasarPayment {
  id: string;
  status: 'initiated' | 'paid' | 'failed';
  source: {
    transaction_url?: string;
  };
}

/**
 * Creates the payment straight from the browser using the publishable key -
 * same reasoning as the Cloudinary upload: the publishable key exists
 * specifically so this call doesn't need our backend or the secret key.
 * The secret key only ever appears server-side, to re-verify this payment
 * after the fact (see PaymentService.confirm_payment) - the browser is
 * never trusted to just say "it worked."
 *
 * amountInHalalas is the smallest currency unit (SAR has 2 decimals, so
 * 100.00 SAR = 10000).
 */
export async function createMoyasarPayment(
  amountInHalalas: number,
  description: string,
  callbackUrl: string,
  card: CardDetails,
): Promise<MoyasarPayment> {
  const response = await fetch('https://api.moyasar.com/v1/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${MOYASAR_PUBLISHABLE_KEY}:`)}`,
    },
    body: JSON.stringify({
      amount: amountInHalalas,
      currency: 'SAR',
      description,
      callback_url: callbackUrl,
      source: {
        type: 'creditcard',
        name: card.name,
        number: card.number,
        month: card.month,
        year: card.year,
        cvc: card.cvc,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? 'تعذر بدء عملية الدفع، تحقق من بيانات البطاقة.');
  }

  return data as MoyasarPayment;
}
