import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

const TABS = [
  { label: 'عميل', to: ROUTES.REGISTER },
  { label: 'مقدم خدمة', to: ROUTES.PROVIDER_REGISTER },
];

export function RegisterTabs() {
  const { pathname } = useLocation();

  return (
    <div className="mb-6 flex gap-1 rounded-lg border border-border p-1">
      {TABS.map((tab) => {
        const isActive = pathname === tab.to;

        return (
          <Link
            key={tab.to}
            to={tab.to}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex-1 rounded-md py-2 text-center text-sm font-medium transition-colors',
              isActive
                ? 'bg-gold text-gold-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}