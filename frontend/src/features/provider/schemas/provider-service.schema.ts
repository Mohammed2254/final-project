import { z } from 'zod';

export const providerServiceSchema = z
  .object({
    serviceType: z.enum(['hall', 'photographer']),
    category_id: z.coerce.number().int().positive('رقم التصنيف مطلوب'),
    service_name: z.string().min(2, 'اسم الخدمة مطلوب').max(150),
    description: z.string().max(1000).optional(),
    price: z.coerce.number().positive('السعر مطلوب'),
    media_url: z.string().url('رابط الصورة غير صحيح').optional().or(z.literal('')),
    is_main: z.boolean().optional(),

    min_capacity: z.coerce.number().int().positive().optional(),
    max_capacity: z.coerce.number().int().positive().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),

    coverage_hours: z.coerce.number().int().positive().optional(),
    camera_type: z.string().optional(),
    has_video: z.boolean().optional(),
    has_drone: z.boolean().optional(),
    portfolio_url: z.string().url('رابط الأعمال غير صحيح').optional().or(z.literal('')),
  })
  .superRefine((value, ctx) => {
    if (value.serviceType === 'hall') {
      if (!value.min_capacity) {
        ctx.addIssue({
          code: 'custom',
          path: ['min_capacity'],
          message: 'أقل سعة مطلوبة',
        });
      }

      if (!value.max_capacity) {
        ctx.addIssue({
          code: 'custom',
          path: ['max_capacity'],
          message: 'أكبر سعة مطلوبة',
        });
      }

      if (value.min_capacity && value.max_capacity && value.max_capacity < value.min_capacity) {
        ctx.addIssue({
          code: 'custom',
          path: ['max_capacity'],
          message: 'أكبر سعة يجب أن تكون أكبر من أقل سعة',
        });
      }

      if (!value.city?.trim()) {
        ctx.addIssue({ code: 'custom', path: ['city'], message: 'المدينة مطلوبة' });
      }

      if (!value.address?.trim()) {
        ctx.addIssue({ code: 'custom', path: ['address'], message: 'العنوان مطلوب' });
      }
    }

    if (value.serviceType === 'photographer' && !value.coverage_hours) {
      ctx.addIssue({
        code: 'custom',
        path: ['coverage_hours'],
        message: 'عدد ساعات التغطية مطلوب',
      });
    }
  });

export type ProviderServiceFormInput = z.input<typeof providerServiceSchema>;
export type ProviderServiceFormValues = z.output<typeof providerServiceSchema>;
