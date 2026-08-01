import { useCallback, useEffect, useState } from 'react';

import { hallService } from '@/features/halls/services/hall.service';
import { ApiException } from '@/types/api';
import type { HallItem } from '@/features/halls/types';

export function useHalls() {
  const [halls, setHalls] = useState<HallItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHalls = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await hallService.list();
      setHalls(data);
    } catch (err) {
      setError(
        err instanceof ApiException ? err.message : 'تعذر تحميل القاعات، يرجى المحاولة مرة أخرى.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHalls();
  }, [fetchHalls]);

  return { halls, isLoading, error, reload: fetchHalls };
}
