import { useState } from 'react';

import { ServiceImage } from '@/components/common/ServiceImage';
import { useServiceGallery } from '@/hooks/useServiceGallery';
import { cn } from '@/lib/utils';

interface ServiceGalleryProps {
  serviceId: number;
  /** Already known by the caller (the details hook's join) - shown immediately
      while the full gallery list is still loading, and used as-is when a
      service has zero or one images so no thumbnail row is needed. */
  fallbackImageUrl: string | null;
  label: string;
  className?: string;
}

export function ServiceGallery({ serviceId, fallbackImageUrl, label, className }: ServiceGalleryProps) {
  const { media } = useServiceGallery(serviceId);
  const [activeIndex, setActiveIndex] = useState(0);

  // The route stays mounted across /halls/1 -> /halls/2, so activeIndex has
  // to reset when the service itself changes - adjusted during render
  // (React's documented pattern for this) rather than in an effect, which
  // would let one render slip by showing the previous service's index first.
  const [trackedServiceId, setTrackedServiceId] = useState(serviceId);
  if (serviceId !== trackedServiceId) {
    setTrackedServiceId(serviceId);
    setActiveIndex(0);
  }

  if (media.length <= 1) {
    return (
      <ServiceImage
        imageUrl={media[0]?.media_url ?? fallbackImageUrl}
        className={className}
        label={label}
      />
    );
  }

  const active = media[activeIndex] ?? media[0];

  return (
    <div className="space-y-2">
      <ServiceImage imageUrl={active.media_url} className={className} label={label} />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {media.map((item, index) => (
          <button
            key={item.media_id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`صورة ${index + 1} من ${media.length}`}
            aria-current={index === activeIndex}
            className={cn(
              'shrink-0 overflow-hidden rounded-md border-2 transition-colors',
              index === activeIndex ? 'border-gold' : 'border-transparent hover:border-border',
            )}
          >
            <img src={item.media_url} alt="" aria-hidden="true" className="h-16 w-20 object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
