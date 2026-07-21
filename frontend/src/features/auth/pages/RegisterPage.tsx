import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { RegisterTabs } from '@/features/auth/components/RegisterTabs';

export default function RegisterPage() {
  return (
    <div>
      <h2 className="text-center text-lg font-extrabold text-foreground">إنشاء حساب جديد</h2>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        ابدأوا رحلتكم في تخطيط زفافكم معاً
      </p>
      <div className="mt-5">
        <RegisterTabs />
        <RegisterForm />
      </div>
    </div>
  );
}
