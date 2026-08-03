import { Link } from 'react-router-dom';

import logo from '@/assets/logo-farah.webp';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

const SECTIONS = [
  { href: '#features', label: 'المميزات' },
  { href: '#how', label: 'كيف تعمل' },
  { href: '#about', label: 'القصة' },
] as const;

/**
 * Floating pill header. Deliberately different from the app's Header: this
 * one only links to sections on the page plus one way into the product, so
 * a visitor isn't pulled off the page before reading it.
 */
export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4 lg:px-8">
      <div className="container mx-auto flex items-center justify-between gap-4 rounded-full border border-border/70 bg-background/70 py-2.5 ps-5 pe-2.5 shadow-sm backdrop-blur-xl">
        <Link to={ROUTES.LANDING} className="shrink-0">
          <img src={logo} alt="فرح" className="h-7 w-auto" />
        </Link>

        <nav aria-label="أقسام الصفحة" className="hidden items-center gap-7 text-sm font-semibold md:flex">
          {SECTIONS.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {section.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="size-8 rounded-full" />
          <Link
            to={ROUTES.HOME}
            className={cn(buttonVariants({ variant: 'gold', size: 'sm' }), 'rounded-full px-5')}
          >
            ادخل المنصة
          </Link>
        </div>
      </div>
    </header>
  );
}
