import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';

import { TextInput } from '@/components/forms/TextInput';
import { PasswordInput } from '@/components/forms/PasswordInput';
import { Button } from '@/components/common/Button';

import { useRegisterProvider } from '@/features/auth/hooks/useRegisterProvider';
import {
  providerRegisterSchema,
  type ProviderRegisterFormValues,
} from '@/features/auth/schemas/auth.schema';

import { ROUTES } from '@/constants/routes';

export function ProviderRegisterForm() {
  const { registerProvider, isLoading, error } =
    useRegisterProvider();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProviderRegisterFormValues>({
    resolver: zodResolver(providerRegisterSchema),
    defaultValues: {
      business_name: '',
      description: '',
      phone_number: '',
      logo_path: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const success = await registerProvider({
      business_name: values.business_name,
      description: values.description || null,
      phone_number: values.phone_number,
      logo_path: values.logo_path || null,
      email: values.email,
      password: values.password,
    });

    if (success) {
      navigate(ROUTES.HOME, {
        replace: true,
      });
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-4"
    >
      {error && (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <TextInput
        label="اسم النشاط التجاري"
        autoComplete="organization"
        placeholder="مثال: قاعة ليالي الرياض"
        error={errors.business_name?.message}
        {...register('business_name')}
      />

      <TextInput
        label="رقم الجوال"
        type="tel"
        autoComplete="tel"
        placeholder="05xxxxxxxx"
        error={errors.phone_number?.message}
        {...register('phone_number')}
      />

      <TextInput
        label="البريد الإلكتروني"
        type="email"
        autoComplete="email"
        placeholder="أدخل بريدك الإلكتروني"
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="space-y-2">
        <label
          htmlFor="provider-description"
          className="text-sm font-medium"
        >
          وصف النشاط
        </label>

        <textarea
          id="provider-description"
          rows={4}
          placeholder="اكتب وصفًا مختصرًا عن خدماتك"
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description
              ? 'provider-description-error'
              : undefined
          }
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          {...register('description')}
        />

        {errors.description && (
          <p
            id="provider-description-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.description.message}
          </p>
        )}
      </div>

      <PasswordInput
        label="كلمة المرور"
        autoComplete="new-password"
        placeholder="أنشئ كلمة مرور"
        error={errors.password?.message}
        {...register('password')}
      />

      <PasswordInput
        label="تأكيد كلمة المرور"
        autoComplete="new-password"
        placeholder="أعد إدخال كلمة المرور"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
        loadingText="جارٍ إنشاء حساب مقدم الخدمة..."
      >
        التسجيل كمقدم خدمة
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        لديك حساب بالفعل؟{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          تسجيل الدخول
        </Link>
      </p>
    </form>
  );
}