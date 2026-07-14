import { ProviderRegisterForm } from '@/features/auth/components/ProviderRegisterForm';

export default function ProviderRegisterPage() {
  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">تسجيل مقدم خدمة</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          أنشئ حسابًا لعرض خدماتك وإدارة حجوزاتك.
        </p>
      </header>

      <ProviderRegisterForm />
    </div>
  );
}