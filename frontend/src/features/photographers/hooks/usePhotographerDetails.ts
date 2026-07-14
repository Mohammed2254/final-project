import { useCallback, useEffect, useState } from 'react';

import { photographerService } from '@/features/photographers/services/photographer.service';
import { ApiException } from '@/types/api';
import type { PhotographerItem } from '@/types/photographer';

export function usePhotographerDetails(id: string | undefined) {
  const [photographer, setPhotographer] = useState<PhotographerItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchPhotographer = useCallback(async () => {
    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const data = await photographerService.getById(id);
      setPhotographer(data);
    } catch (err) {
      if (err instanceof ApiException && err.status === 404) {
        setNotFound(true);
      } else {
        setError(
          err instanceof ApiException
            ? err.message
            : 'تعذر تحميل بيانات المصور، يرجى المحاولة مرة أخرى.',
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPhotographer();
  }, [fetchPhotographer]);

  return { photographer, isLoading, error, notFound, reload: fetchPhotographer };
}
