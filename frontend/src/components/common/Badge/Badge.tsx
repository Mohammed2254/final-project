import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold whitespace-nowrap [&_svg]:size-3 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        neutral: 'border-border bg-muted text-muted-foreground',
        success: 'border-success/25 bg-success-subtle text-success',
        warning: 'border-warning/25 bg-warning-subtle text-warning',
        danger: 'border-destructive/25 bg-destructive-subtle text-destructive',
        info: 'border-info/25 bg-info-subtle text-info',
        gold: 'border-transparent bg-gold text-gold-foreground',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

interface BadgeProps
  extends React.ComponentProps<'span'>,
    VariantProps<typeof badgeVariants> {
  /** Rendered before the label. Decorative - the label carries the meaning. */
  icon?: React.ReactNode;
}

/**
 * Status pill. Colour alone never carries the meaning: every badge pairs a
 * tint with a text label, and callers should pass an `icon` too so the state
 * survives greyscale and colour-blindness.
 */
export function Badge({ className, variant, icon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon && <span aria-hidden="true" className="inline-flex">{icon}</span>}
      {children}
    </span>
  );
}
