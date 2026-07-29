import { useCallback, useEffect, useState } from 'react';

import { hallService, type HallListParams } from '@/features/halls/services/hall.service';
import { ApiException } from '@/types/api';
import type { HallItem } from '@/types/hall';

export function useHalls(params: HallListParams) {
  // hallService.list() already returns HallItem (service + hall_details),
  // so typing this as ServiceItem was throwing away city/capacity.
  const [halls, setHalls] = useState<HallItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Only re-fetch when the actual filter values change, not on every
  // render (params is a fresh object each render from the caller).
  const { keyword, minPrice, maxPrice } = params;

  const fetchHalls = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await hallService.list({ keyword, minPrice, maxPrice });
      setHalls(data);
    } catch (err) {
      setError(
        err instanceof ApiException ? err.message : 'تعذر تحميل القاعات، يرجى المحاولة مرة أخرى.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [keyword, minPrice, maxPrice]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHalls();
  }, [fetchHalls]);

  return { halls, isLoading, error, reload: fetchHalls };
}
