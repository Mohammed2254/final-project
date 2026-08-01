import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Plain bordered surface (border + radius, no shadow) used for feature
 * cards, hall cards, category tiles, forms, etc. so none of those
 * re-implement the same wrapper.
 */
export function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn('rounded-2xl border border-border bg-card text-card-foreground', className)}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-body" className={cn('p-4', className)} {...props} />;
}