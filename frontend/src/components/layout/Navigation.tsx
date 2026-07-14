import { NavLink } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

const NAV_ITEMS = [
  { to: ROUTES.HOME, label: 'الرئيسية', end: true },
  { to: ROUTES.HALLS, label: 'القاعات', end: false },
  { to: ROUTES.PHOTOGRAPHERS, label: 'التصوير', end: true },
  { to: ROUTES.ABOUT, label: 'من نحن', end: true },
] as const;

export function Navigation({ className }: { className?: string }) {
  return (
    <nav className={cn('flex items-center gap-6 text-sm text-muted-foreground', className)}>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'transition-colors hover:text-foreground',
              isActive && 'font-bold text-gold',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}