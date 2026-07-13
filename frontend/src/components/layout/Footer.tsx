import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

const FOOTER_LINKS = [
  { to: ROUTES.HOME, label: 'الرئيسية' },
  { to: ROUTES.HALLS, label: 'القاعات' },
  { to: ROUTES.PHOTOGRAPHERS, label: 'التصوير' },
  { to: ROUTES.WEDDING_PLANNER, label: 'مخطط الزفاف' },
  { to: ROUTES.FAVORITES, label: 'المفضلة' },
  { to: ROUTES.ABOUT, label: 'من نحن' },
] as const;

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

        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs">© {new Date().getFullYear()} فرح. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}