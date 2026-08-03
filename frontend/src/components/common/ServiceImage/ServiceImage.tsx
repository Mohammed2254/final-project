import { useState } from 'react';

import { PlaceholderImage } from '@/components/common/PlaceholderImage';
import { cn } from '@/lib/utils';

interface ServiceImageProps {
  imageUrl: string | null;
  label?: string;
  className?: string;
}

/** Falls back to PlaceholderImage when the image is missing or fails to load. */
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
