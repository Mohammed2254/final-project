import { Link } from 'react-router-dom';
import { Code, Mail } from 'lucide-react';

import logo from '@/assets/logo-farah.webp';
import { ROUTES } from '@/constants/routes';

const FOOTER_SECTIONS = [
  {
    title: 'تصفّح',
    links: [
      { to: ROUTES.HALLS, label: 'القاعات' },
      { to: ROUTES.PHOTOGRAPHERS, label: 'التصوير' },
      { to: ROUTES.FAVORITES, label: 'المفضلة' },
    ],
  },
  {
    title: 'التخطيط',
    links: [
      { to: ROUTES.WEDDING_PLANNER, label: 'مخطط الزفاف' },
      { to: ROUTES.MY_BOOKINGS, label: 'حجوزاتي' },
    ],
  },
  {
    title: 'المنصة',
    links: [
      { to: ROUTES.HOME, label: 'الرئيسية' },
      { to: ROUTES.ABOUT, label: 'من نحن' },
    ],
  },
] as const;

const REPO_URL = 'https://github.com/Mohammed2254/final-project';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-10 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <img src={logo} alt="فرح" className="h-7 w-auto" />
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground">
              منصة التخطيط المشترك لحفلات الزفاف — اكتشفوا القاعات وخدمات التصوير في مكان واحد.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="المستودع على GitHub"
                className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-gold hover:text-foreground"
              >
                <Code size={15} aria-hidden="true" />
              </a>
              <a
                href="mailto:support@farah.sa"
                aria-label="راسلنا عبر البريد"
                className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-gold hover:text-foreground"
              >
                <Mail size={15} aria-hidden="true" />
              </a>
            </div>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <p className="text-sm font-bold text-foreground">{section.title}</p>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} فرح. جميع الحقوق محفوظة.</p>
          <p>مشروع تخرّج — Holberton School</p>
        </div>
      </div>
    </footer>
  );
}
