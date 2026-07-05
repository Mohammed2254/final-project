import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div>
      <h2 className="text-center text-lg font-extrabold text-foreground">إعادة تعيين كلمة المرور</h2>
      <p className="mt-1 text-center text-sm text-muted-foreground">أدخل كلمة مرور جديدة لحسابك</p>
      <div className="mt-5">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
