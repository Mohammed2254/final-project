import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { TextInput } from '@/components/forms/TextInput';
import { PasswordInput } from '@/components/forms/PasswordInput';
import { GoldButton } from '@/components/common/GoldButton';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/auth.schema';
import { ROUTES } from '@/constants/routes';

export function LoginForm() {
  const { login, isLoading, error } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    const session = await login(values);
    if (session) {
      const defaultRoute = session.account.role === 'Provider'
        ? ROUTES.PROVIDER_DASHBOARD
        : ROUTES.HOME;
      const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? defaultRoute;
      navigate(redirectTo, { replace: true });
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
        label="البريد الإلكتروني"
        type="email"
        autoComplete="email"
        placeholder="ادخل بريدك الإلكتروني"
        error={errors.email?.message}
        {...register('email')}
      />

      <div>
        <PasswordInput
          label="كلمة المرور"
          autoComplete="current-password"
          placeholder="ادخل كلمة المرور"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="mt-1.5 text-end">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>
      </div>

      <GoldButton type="submit" className="w-full" isLoading={isLoading} loadingText="جارٍ تسجيل الدخول...">
        تسجيل الدخول
      </GoldButton>

      <p className="text-center text-sm text-muted-foreground">
        ليس لديك حساب؟{' '}
        <Link to={ROUTES.REGISTER} className="font-medium text-foreground underline-offset-4 hover:underline">
          إنشاء حساب
        </Link>
      </p>
    </form>
  );
}
