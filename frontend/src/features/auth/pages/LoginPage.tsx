import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-center text-lg font-extrabold text-foreground">مرحباً بعودتك 👋</h2>
      <p className="mt-1 text-center text-sm text-muted-foreground">سجل دخولك للمتابعة</p>
      <div className="mt-5">
        <LoginForm />
      </div>
    </div>
  );
}
