import { useCallback, useEffect, useState } from 'react';

import {
  photographerService,
  type PhotographerListParams,
} from '@/features/photographers/services/photographer.service';
import { ApiException } from '@/types/api';
import type { PhotographerItem } from '@/types/photographer';

export function usePhotographers(params: PhotographerListParams) {
  const [photographers, setPhotographers] = useState<PhotographerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Only re-fetch when the actual filter values change, not on every
  // render (params is a fresh object each render from the caller).
  const { keyword, minPrice, maxPrice } = params;

  const fetchPhotographers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await photographerService.list({ keyword, minPrice, maxPrice });
      setPhotographers(data);
    } catch (err) {
      setError(
        err instanceof ApiException ? err.message : 'تعذر تحميل المصورين، يرجى المحاولة مرة أخرى.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [keyword, minPrice, maxPrice]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPhotographers();
  }, [fetchPhotographers]);

  return { photographers, isLoading, error, reload: fetchPhotographers };
}
