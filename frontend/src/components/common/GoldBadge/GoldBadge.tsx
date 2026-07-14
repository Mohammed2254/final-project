import * as React from 'react';

import { cn } from '@/lib/utils';

type GoldBadgeProps = React.ComponentProps<'span'>;

/** Solid gold pill for brand-accent labels (e.g. "Popular"). Opt in per call site. */
export function GoldBadge({ className, ...props }: GoldBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-gold px-2.5 py-0.5 text-xs font-bold text-gold-foreground',
        className,
      )}
      {...props}
    />
  );
}