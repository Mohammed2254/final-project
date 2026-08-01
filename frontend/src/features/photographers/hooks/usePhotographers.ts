import { useCallback, useEffect, useState } from 'react';

import { photographerService } from '@/features/photographers/services/photographer.service';
import { ApiException } from '@/types/api';
import type { PhotographerItem } from '@/features/photographers/types';

export function usePhotographers() {
  const [photographers, setPhotographers] = useState<PhotographerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotographers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await photographerService.list();
      setPhotographers(data);
    } catch (err) {
      setError(
        err instanceof ApiException ? err.message : 'تعذر تحميل المصورين، يرجى المحاولة مرة أخرى.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPhotographers();
  }, [fetchPhotographers]);

  return { photographers, isLoading, error, reload: fetchPhotographers };
}
