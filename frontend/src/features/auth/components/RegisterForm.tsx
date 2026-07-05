import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';

import { TextInput } from '@/components/forms/TextInput';
import { PasswordInput } from '@/components/forms/PasswordInput';
import { Button } from '@/components/common/Button';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas/auth.schema';
import { ROUTES } from '@/constants/routes';

export function RegisterForm() {
  const { register: registerCustomer, isLoading, error } = useRegister();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    const success = await registerCustomer({
      full_name: values.full_name,
      email: values.email,
      password: values.password,
    });
    if (success) {
      navigate(ROUTES.HOME, { replace: true });
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {error && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <TextInput
        label="الاسم الكامل"
        autoComplete="name"
        placeholder="ادخل اسمك الكامل"
        error={errors.full_name?.message}
        {...register('full_name')}
      />

      <TextInput
        label="البريد الإلكتروني"
        type="email"
        autoComplete="email"
        placeholder="ادخل بريدك الإلكتروني"
        error={errors.email?.message}
        {...register('email')}
      />

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

      <Button type="submit" className="w-full" isLoading={isLoading} loadingText="جارٍ إنشاء الحساب...">
        إنشاء حساب
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        لديك حساب بالفعل؟{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-foreground underline-offset-4 hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </form>
  );
}
