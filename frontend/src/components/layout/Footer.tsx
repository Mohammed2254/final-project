import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <p className="text-base font-extrabold text-foreground">فرح</p>
          <p className="mt-1 max-w-xs text-xs leading-relaxed">
            منصة التخطيط المشترك لحفلات الزفاف — اكتشفوا القاعات وخدمات التصوير في مكان واحد.
          </p>
        </div>

        <nav className="flex gap-5">
          <Link to={ROUTES.HOME} className="hover:text-foreground">
            الرئيسية
          </Link>
          <Link to={ROUTES.HALLS} className="hover:text-foreground">
            القاعات
          </Link>
          <Link to={ROUTES.ABOUT} className="hover:text-foreground">
            من نحن
          </Link>
        </nav>

        <p className="text-xs">© {new Date().getFullYear()} فرح. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}