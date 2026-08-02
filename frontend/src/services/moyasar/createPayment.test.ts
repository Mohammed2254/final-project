import { describe, it, expect, vi, afterEach } from 'vitest';

import { createMoyasarPayment } from '@/services/moyasar/createPayment';

const card = { name: 'Test Customer', number: '4111111111111111', month: '12', year: '2027', cvc: '123' };

afterEach(() => {
  vi.restoreAllMocks();
});

describe('createMoyasarPayment', () => {
  it('returns the payment on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'pay_123', status: 'initiated', source: { transaction_url: 'https://x' } }),
      }),
    );

    const payment = await createMoyasarPayment(10000, 'Test booking', 'https://app/callback', card);

    expect(payment.id).toBe('pay_123');
    expect(payment.source.transaction_url).toBe('https://x');
  });

  it('sends amount in halalas and the card fields Moyasar expects', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'pay_123', status: 'paid', source: {} }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await createMoyasarPayment(10000, 'Test booking', 'https://app/callback', card);

    const [, options] = fetchMock.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.amount).toBe(10000);
    expect(body.currency).toBe('SAR');
    expect(body.source.type).toBe('creditcard');
    expect(body.source.number).toBe(card.number);
  });

  it('throws with the gateway message when Moyasar rejects the request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Invalid card number' }),
      }),
    );

    await expect(
      createMoyasarPayment(10000, 'Test booking', 'https://app/callback', card),
    ).rejects.toThrow('Invalid card number');
  });
});
