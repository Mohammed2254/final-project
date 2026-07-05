import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { ROUTES } from '@/constants/routes';

/**
 * Reused by every authentication screen (login, register, forgot/reset
 * password). Mirrors the "02/03 - Authentication" wireframes: a simple
 * top bar with the logo + a link back home, and a centered card for the form.
 */
export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-8">
        <Link to={ROUTES.HOME} className="text-xl font-extrabold tracking-wide text-foreground">
          فرح
        </Link>
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          العودة للرئيسية
          <ArrowLeft size={14} aria-hidden="true" />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-[380px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
