import { useState } from 'react';

import { PlaceholderImage } from '@/components/common/PlaceholderImage';
import { cn } from '@/lib/utils';

interface ServiceImageProps {
  imageUrl: string | null;
  label?: string;
  className?: string;
}

/**
 * Renders the service's real main image (from service_media) when one
 * exists and loads successfully; falls back to the decorative
 * PlaceholderImage otherwise - never a browser broken-image icon.
 */
export function ServiceImage({ imageUrl, label, className }: ServiceImageProps) {
  const [failed, setFailed] = useState(false);

  if (!imageUrl || failed) {
    return <PlaceholderImage className={className} label={label} />;
  }

  return (
    <img
      src={imageUrl}
      alt={label ?? ''}
      className={cn('object-cover', className)}
      onError={() => setFailed(true)}
    />
  );
}
