import { useCallback, useEffect, useState } from 'react';

import { hallService } from '@/features/halls/services/hall.service';
import { ApiException } from '@/types/api';
import type { HallItem } from '@/types/hall';

export function useHallDetails(id: string | undefined) {
  const [hall, setHall] = useState<HallItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchHall = useCallback(async () => {
    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const data = await hallService.getById(id);
      setHall(data);
    } catch (err) {
      if (err instanceof ApiException && err.status === 404) {
        setNotFound(true);
      } else {
        setError(
          err instanceof ApiException
            ? err.message
            : 'تعذر تحميل بيانات القاعة، يرجى المحاولة مرة أخرى.',
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHall();
  }, [fetchHall]);

  return { hall, isLoading, error, notFound, reload: fetchHall };
}
