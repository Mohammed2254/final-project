import { z } from 'zod';

/**
 * The checksum every real card number satisfies. Catches typos before we
 * send the card to Moyasar and get a rejection back.
 */
function passesLuhn(digits: string): boolean {
  let sum = 0;
  let double = false;

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let value = Number(digits[i]);

    if (double) {
      value *= 2;
      if (value > 9) value -= 9;
    }

    sum += value;
    double = !double;
  }

  return sum % 10 === 0;
}

/**
 * Fields stay raw strings so the form can keep the spaces a user types into
 * the card number. Every rule strips to digits itself, and the submit
 * handler strips again before the value reaches Moyasar.
 */
export const digitsOnly = (value: string) => value.replace(/\D/g, '');

export const cardSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'الاسم على البطاقة مطلوب')
      .max(100, 'الاسم طويل جداً'),

    number: z
      .string()
      .refine((value) => {
        const digits = digitsOnly(value);
        return digits.length >= 13 && digits.length <= 19;
      }, { message: 'رقم البطاقة يجب أن يكون بين 13 و 19 رقماً' })
      .refine((value) => passesLuhn(digitsOnly(value)), {
        message: 'رقم البطاقة غير صحيح',
      }),

    month: z.string().refine((value) => {
      const month = Number(digitsOnly(value));
      return month >= 1 && month <= 12;
    }, { message: 'الشهر يجب أن يكون بين 1 و 12' }),

    year: z
      .string()
      .refine((value) => digitsOnly(value).length === 4, {
        message: 'أدخلوا السنة بأربعة أرقام',
      }),

    cvc: z.string().refine((value) => {
      const digits = digitsOnly(value);
      return digits.length >= 3 && digits.length <= 4;
    }, { message: 'رمز التحقق يجب أن يكون 3 أو 4 أرقام' }),
  })
  // Runs only after every field-level rule above passes, so month and year
  // are already known to be sane numbers by the time we compare them to today.
  .refine(
    (values) => {
      const now = new Date();
      const expiryYear = Number(digitsOnly(values.year));
      const expiryMonth = Number(digitsOnly(values.month));

      if (expiryYear > now.getFullYear()) return true;
      if (expiryYear < now.getFullYear()) return false;
      return expiryMonth >= now.getMonth() + 1;
    },
    { message: 'البطاقة منتهية الصلاحية', path: ['year'] },
  );

export type CardFormValues = z.infer<typeof cardSchema>;
