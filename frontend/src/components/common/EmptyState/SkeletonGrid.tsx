import { cn } from '@/lib/utils';

interface SkeletonGridProps {
  count?: number;
  className?: string;
}

/**
 * Card-shaped loading placeholders for the halls grid and featured sections.
 * The radius matches the real Card, so the skeleton doesn't visibly change
 * shape the moment content loads.
 */
export function SkeletonGrid({ count = 4, className }: SkeletonGridProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-2xl border border-border">
          <div className="h-32 rounded-t-2xl bg-muted" />
          <div className="space-y-2 p-4">
            <div className="h-3.5 w-3/4 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
            <div className="h-3 w-1/4 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}