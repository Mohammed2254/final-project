import { useLogout } from '@/features/auth/hooks/useLogout';

export default function HomePage() {
  const { logout } = useLogout();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold">Home Page</h1>

      <p className="mb-6">
        Welcome to the Hall Booking Platform.
      </p>

      <button
        onClick={logout}
        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        تسجيل الخروج
      </button>
    </div>
  );
}