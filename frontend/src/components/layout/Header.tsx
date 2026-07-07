import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

export function Header() {
  const { isAuthenticated, account, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate(ROUTES.HOME);
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-3.5 lg:px-8">
        <Link to={ROUTES.HOME} className="text-lg font-extrabold tracking-wide text-foreground">
          فرح
        </Link>

        <Navigation className="hidden md:flex" />

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">{account?.email}</span>
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
              <Button size="sm" onClick={() => navigate(ROUTES.REGISTER)}>
                إنشاء حساب
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="text-foreground md:hidden"
          aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border px-4 py-4 md:hidden">
          <Navigation className="flex-col items-start gap-4" />
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">{account?.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  تسجيل الدخول
                </Link>
                <Button size="sm" onClick={() => navigate(ROUTES.REGISTER)}>
                  إنشاء حساب
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}