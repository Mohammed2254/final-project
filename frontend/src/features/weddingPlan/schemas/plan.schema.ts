import { z } from 'zod';

/** Midnight today, so "the wedding is later today" still counts as valid. */
function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export const createPlanSchema = z.object({
  planName: z
    .string()
    .trim()
    .min(2, 'اسم الخطة يجب ألا يقل عن حرفين')
    .max(100, 'اسم الخطة طويل جداً'),

  eventDate: z
    .string()
    .min(1, 'تاريخ المناسبة مطلوب')
    .refine((value) => !Number.isNaN(Date.parse(value)), { message: 'تاريخ غير صحيح' })
    .refine((value) => new Date(value) >= startOfToday(), {
      message: 'تاريخ المناسبة يجب أن يكون اليوم أو بعده',
    }),

  budget: z
    .string()
    .min(1, 'الميزانية مطلوبة')
    .refine((value) => Number(value) > 0, { message: 'الميزانية يجب أن تكون أكبر من صفر' })
    .refine((value) => Number(value) <= 10_000_000, { message: 'الميزانية أكبر من الحد المسموح' }),

  notes: z.string().trim().max(500, 'الملاحظات يجب ألا تتجاوز 500 حرف'),
});

export type CreatePlanFormValues = z.infer<typeof createPlanSchema>;

export const invitePartnerSchema = z.object({
  invitedEmail: z
    .string()
    .trim()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('يرجى إدخال بريد إلكتروني صحيح'),
});

export type InvitePartnerFormValues = z.infer<typeof invitePartnerSchema>;

export const inviteCodeSchema = z.object({
  code: z.string().trim().min(4, 'رمز الدعوة غير مكتمل').max(64, 'رمز الدعوة غير صحيح'),
});

export type InviteCodeFormValues = z.infer<typeof inviteCodeSchema>;
