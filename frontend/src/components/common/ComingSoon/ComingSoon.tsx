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
  backLabel?: string;
  backTo?: string;
}

/** Placeholder for a route that should resolve but has no backend behind it yet. */
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