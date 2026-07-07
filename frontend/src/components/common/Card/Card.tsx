import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Plain bordered surface matching the approved Figma card style
 * (border + radius, no shadow). Used for feature cards, hall cards,
 * category tiles, etc. so none of those re-implement the same wrapper.
 */
export function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn('rounded-lg border border-border bg-card text-card-foreground', className)}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-body" className={cn('p-4', className)} {...props} />;
}