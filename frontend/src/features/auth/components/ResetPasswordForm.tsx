import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { PasswordInput } from '@/components/forms/PasswordInput';
import { GoldButton } from '@/components/common/GoldButton';
import { useResetPassword } from '@/features/auth/hooks/useResetPassword';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/features/auth/schemas/auth.schema';
import { ROUTES } from '@/constants/routes';

export function ResetPasswordForm() {
  const { submit, isLoading, error } = useResetPassword();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!token) return;
    const success = await submit({ token, password: values.password });
    if (success) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  });

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p role="alert" className="text-sm text-destructive">
          رابط إعادة التعيين غير صالح أو منتهي الصلاحية.
        </p>
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="inline-block text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          طلب رابط جديد
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {error && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <PasswordInput
        label="كلمة المرور الجديدة"
        autoComplete="new-password"
        placeholder="أنشئ كلمة مرور جديدة"
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

      <GoldButton type="submit" className="w-full" isLoading={isLoading} loadingText="جارٍ الحفظ...">
        حفظ كلمة المرور الجديدة
      </GoldButton>
    </form>
  );
}
