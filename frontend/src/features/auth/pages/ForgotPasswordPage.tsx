import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div>
      <h2 className="text-center text-lg font-extrabold text-foreground">نسيت كلمة المرور؟</h2>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
      </p>
      <div className="mt-5">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
