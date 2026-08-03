import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import logo from '@/assets/logo-farah.webp';
import { ROUTES } from '@/constants/routes';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-8">
        {/* Not signed in yet, so both links go to the marketing page. */}
        <Link to={ROUTES.LANDING}>
          <img src={logo} alt="فرح" className="h-9 w-auto" />
        </Link>
        <Link
          to={ROUTES.LANDING}
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
