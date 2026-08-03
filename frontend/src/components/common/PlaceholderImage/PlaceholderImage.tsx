import { ImageOff } from 'lucide-react';

import { cn } from '@/lib/utils';

interface PlaceholderImageProps {
  className?: string;
  label?: string;
}

/** Stand-in for a service with no image, so a card never shows a broken <img>. */
export function PlaceholderImage({ className, label }: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,var(--border)_8px,var(--border)_9px)] bg-muted/40 text-muted-foreground',
        className,
      )}
      role="img"
      aria-label={label ?? 'لا توجد صورة متاحة'}
    >
      <ImageOff size={22} aria-hidden="true" />
    </div>
  );
}