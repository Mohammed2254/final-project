import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';

import { TextInput } from '@/components/forms/TextInput';
import { GoldButton } from '@/components/common/GoldButton';
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/schemas/auth.schema';
import { ROUTES } from '@/constants/routes';

export function ForgotPasswordForm() {
  const { submit, isLoading, error, isSent } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = handleSubmit((values) => submit(values));

  if (isSent) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-lg font-extrabold">تحقق من بريدك الإلكتروني</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          أرسلنا رابط إعادة تعيين كلمة المرور إلى{' '}
          <span className="font-medium text-foreground">{getValues('email')}</span>
        </p>
        <Link
          to={ROUTES.LOGIN}
          className="inline-block text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          العودة لتسجيل الدخول
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

      <TextInput
        label="البريد الإلكتروني"
        type="email"
        autoComplete="email"
        placeholder="ادخل بريدك الإلكتروني"
        error={errors.email?.message}
        {...register('email')}
      />

      <GoldButton type="submit" className="w-full" isLoading={isLoading} loadingText="جارٍ الإرسال...">
        إرسال رابط إعادة التعيين
      </GoldButton>

      <p className="text-center text-sm text-muted-foreground">
        تذكرت كلمة المرور؟{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-foreground underline-offset-4 hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </form>
  );
}
