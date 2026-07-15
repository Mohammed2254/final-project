import { z } from 'zod';

export const bookingCreateSchema = z.object({
  event_date: z
    .string()
    .min(1, 'تاريخ المناسبة مطلوب'),

  notes: z
    .string()
    .trim()
    .max(500, 'الملاحظات يجب ألا تتجاوز 500 حرف')
    .optional(),
});

export type BookingCreateFormValues = z.infer<
  typeof bookingCreateSchema
>;