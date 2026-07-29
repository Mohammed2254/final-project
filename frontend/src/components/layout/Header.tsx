import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import logo from '@/assets/logo-farah.webp';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/common/Button';
import { GoldButton } from '@/components/common/GoldButton';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

export function Header() {
  const { isAuthenticated, account, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Navigating from inside the sheet should close it - otherwise the menu
  // stays open on top of the page you just moved to. Adjusting during render
  // (React's documented pattern for reacting to a changed value) avoids the
  // extra commit an effect would cost.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setIsMenuOpen(false);
  }

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    // Back to the marketing page - you're a guest again at this point.
    navigate(ROUTES.LANDING);
  };

  const accountLink =
    account?.role === 'Provider'
      ? { to: ROUTES.PROVIDER_DASHBOARD, label: 'لوحة التحكم' }
      : { to: ROUTES.MY_BOOKINGS, label: 'حجوزاتي' };

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 lg:px-6 lg:pt-4">
      <div className="container mx-auto flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/75 px-4 py-3 shadow-sm backdrop-blur-xl lg:px-6">
        <Link to={ROUTES.HOME} className="shrink-0">
          <img src={logo} alt="فرح" className="h-8 w-auto" />
        </Link>

        <Navigation className="hidden md:flex" />

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Link
                to={accountLink.to}
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {accountLink.label}
              </Link>
              <span className="max-w-[14ch] truncate text-sm text-muted-foreground" title={account?.email}>
                {account?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                تسجيل الخروج
              </Button>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                تسجيل الدخول
              </Link>
              <GoldButton size="sm" onClick={() => navigate(ROUTES.REGISTER)}>
                إنشاء حساب
              </GoldButton>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground"
            aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="container mx-auto mt-2 rounded-2xl border border-border/70 bg-background/95 px-5 py-4 shadow-lg backdrop-blur-xl md:hidden">
          <Navigation className="flex-col items-start gap-4" />

          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={accountLink.to}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {accountLink.label}
                </Link>
                <span className="truncate text-sm text-muted-foreground">{account?.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className="text-sm text-muted-foreground hover:text-foreground">
                  تسجيل الدخول
                </Link>
                <GoldButton size="sm" onClick={() => navigate(ROUTES.REGISTER)}>
                  إنشاء حساب
                </GoldButton>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
