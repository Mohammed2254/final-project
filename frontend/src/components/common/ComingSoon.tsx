import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

import { Card } from '@/components/common/Card';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Defaults to a "back to home" link; pass a different destination if more useful. */
  backLabel?: string;
  backTo?: string;
}

/**
 * Shared placeholder for any feature whose backend route doesn't exist
 * yet (booking_routes.py, favorite_routes.py, provider_routes.py, etc.
 * are all empty). Used instead of leaving these paths unrouted (404) or
 * building UI that calls endpoints that don't exist.
 */
export function ComingSoon({
  icon: Icon,
  title,
  description,
  backLabel = 'العودة إلى الرئيسية',
  backTo = ROUTES.HOME,
}: ComingSoonProps) {
  return (
    <div className="container mx-auto px-4 py-16 lg:px-8">
      <Card className="mx-auto flex max-w-xl flex-col items-center gap-4 p-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full border border-border text-muted-foreground">
          <Icon size={26} aria-hidden="true" />
        </span>

        <div>
          <h1 className="text-xl font-extrabold text-foreground">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>

        <Link to={backTo} className={cn(buttonVariants({ size: 'lg' }))}>
          {backLabel}
        </Link>
      </Card>
    </div>
  );
}