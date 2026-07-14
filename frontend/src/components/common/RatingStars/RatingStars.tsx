import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  size?: number;
  className?: string;
}

/**
 * UI-only 5-star rating display. Not wired into any page yet - the backend
 * has no rating field on Service, so there's no real data to pass it.
 */
export function RatingStars({ rating, size = 14, className }: RatingStarsProps) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          aria-hidden="true"
          className={i <= Math.round(rating) ? 'fill-gold text-gold' : 'text-border'}
        />
      ))}
    </span>
  );
}