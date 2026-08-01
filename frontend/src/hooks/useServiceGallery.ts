import { useCallback, useEffect, useState } from 'react';

import { serviceMediaEndpoints } from '@/services/api/endpoints';
import type { ServiceMediaRecord } from '@/types/service';

/** Main image first, so it's the default selection when a gallery renders. */
export function sortMediaMainFirst(media: ServiceMediaRecord[]): ServiceMediaRecord[] {
  return [...media].sort((a, b) => Number(b.is_main) - Number(a.is_main));
}

/**
 * Read-only - the caller (a public detail page) never edits media, only
 * features/provider/hooks/useServiceMedia.ts does that. Failures are
 * swallowed to an empty list rather than surfaced as an error: the page
 * already has a fallback main image, so a broken gallery fetch should mean
 * "no thumbnails," not a broken page.
 */
export function useServiceGallery(serviceId: number | string) {
  const [media, setMedia] = useState<ServiceMediaRecord[]>([]);

  const load = useCallback(async () => {
    try {
      const { data } = await serviceMediaEndpoints.byService(serviceId);
      setMedia(sortMediaMainFirst(data.data));
    } catch {
      setMedia([]);
    }
  }, [serviceId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return { media };
}
