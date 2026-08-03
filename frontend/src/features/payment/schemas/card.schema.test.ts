import { describe, it, expect } from 'vitest';

import { cardSchema, toFourDigitYear } from '@/features/payment/schemas/card.schema';

const nextTwoDigitYear = String((new Date().getFullYear() + 1) % 100).padStart(2, '0');

const validCard = {
  name: 'Mohammed Alabdali',
  number: '4111 1111 1111 1111',
  month: '12',
  year: nextTwoDigitYear,
  cvc: '123',
};

describe('cardSchema', () => {
  it('accepts a valid card, spaces and all', () => {
    expect(cardSchema.safeParse(validCard).success).toBe(true);
  });

  it('rejects letters typed into the card number', () => {
    const result = cardSchema.safeParse({ ...validCard, number: 'abcdefghijkl' });
    expect(result.success).toBe(false);
  });

  it('rejects a number that fails the Luhn checksum', () => {
    const result = cardSchema.safeParse({ ...validCard, number: '4111 1111 1111 1112' });
    expect(result.success).toBe(false);
  });

  it('rejects a month outside 1-12', () => {
    expect(cardSchema.safeParse({ ...validCard, month: '13' }).success).toBe(false);
    expect(cardSchema.safeParse({ ...validCard, month: '0' }).success).toBe(false);
  });

  it('rejects an expired card and points at the year field', () => {
    const result = cardSchema.safeParse({ ...validCard, year: '20' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('year');
    }
  });

  it('rejects a 4-digit year - only two digits are accepted, like on the card', () => {
    expect(cardSchema.safeParse({ ...validCard, year: `20${validCard.year}` }).success).toBe(false);
  });

  it('rejects a CVC that is too short', () => {
    expect(cardSchema.safeParse({ ...validCard, cvc: '12' }).success).toBe(false);
  });
});

describe('toFourDigitYear', () => {
  it('prefixes a two-digit year with 20, for Moyasar', () => {
    expect(toFourDigitYear('27')).toBe('2027');
  });
});
