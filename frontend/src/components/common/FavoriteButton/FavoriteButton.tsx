import { Heart } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';

interface FavoriteButtonProps {
  serviceId: number;
  className?: string;
}

/**
 * Real, interactive favorite toggle - sits as a sibling of the card's Link
 * (not nested inside it), positioned absolutely by the caller, so clicking
 * it never triggers card navigation.
 */
export function FavoriteButton({ serviceId, className }: FavoriteButtonProps) {
  const { isFavorited, toggleFavorite } = useFavorites();
  const active = isFavorited(serviceId);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void toggleFavorite(serviceId);
      }}
      aria-pressed={active}
      aria-label={active ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
      className={cn(
        'flex items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-gold',
        active && 'text-gold',
        className,
      )}
    >
      <Heart size={16} className={active ? 'fill-gold' : ''} aria-hidden="true" />
    </button>
  );
}
