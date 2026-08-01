import * as React from 'react';

import { cn } from '@/lib/utils';

/** Owns the app's card radius - pages should not override it per-page. */
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