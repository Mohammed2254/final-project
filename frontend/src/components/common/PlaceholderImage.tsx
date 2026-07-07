import { ImageOff } from 'lucide-react';

import { cn } from '@/lib/utils';

interface PlaceholderImageProps {
  className?: string;
  label?: string;
}

/**
 * The Service API doesn't return any media yet (see service_schema.py -
 * no image/gallery fields), so every hall/service card needs a graceful
 * stand-in instead of a broken <img>. Mirrors the diagonal-hatch "ph"
 * block from the approved Figma wireframes.
 */
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