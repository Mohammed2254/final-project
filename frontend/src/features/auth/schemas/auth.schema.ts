import { z } from 'zod';

const email = z
  .string()
  .min(1, 'البريد الإلكتروني مطلوب')
  .email('يرجى إدخال بريد إلكتروني صحيح');

const password = z
  .string()
  .min(8, 'كلمة المرور يجب ألا تقل عن 8 أحرف')
  .max(128, 'كلمة المرور طويلة جداً');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(2, 'الاسم الكامل يجب ألا يقل عن حرفين')
      .max(100, 'الاسم الكامل طويل جداً'),
    email,
    password,
    confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const providerRegisterSchema = z
  .object({
    business_name: z
      .string()
      .trim()
      .min(2, 'اسم النشاط يجب أن يحتوي على حرفين على الأقل')
      .max(150, 'اسم النشاط يجب ألا يتجاوز 150 حرفًا'),

    description: z
      .string()
      .trim()
      .max(500, 'الوصف يجب ألا يتجاوز 500 حرف')
      .optional(),

    phone_number: z
      .string()
      .trim()
      .min(8, 'رقم الجوال يجب أن يحتوي على 8 أرقام على الأقل')
      .max(20, 'رقم الجوال يجب ألا يتجاوز 20 خانة'),

    logo_path: z
      .string()
      .trim()
      .optional(),

    email: z
      .string()
      .trim()
      .email('البريد الإلكتروني غير صحيح'),

    password: z
      .string()
      .min(8, 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل')
      .max(128, 'كلمة المرور طويلة جدًا'),

    confirmPassword: z
      .string()
      .min(1, 'يرجى تأكيد كلمة المرور'),
  })
  .refine(
    (values) => values.password === values.confirmPassword,
    {
      message: 'كلمتا المرور غير متطابقتين',
      path: ['confirmPassword'],
    }
  );

export type ProviderRegisterFormValues = z.infer<
  typeof providerRegisterSchema
>;