import { useCallback, useEffect, useState } from 'react';

import { serviceMediaEndpoints } from '@/services/api/endpoints';
import { ApiException } from '@/types/api';
import type { ServiceMediaRecord } from '@/types/service';

export function useServiceMedia(serviceId: number) {
  const [media, setMedia] = useState<ServiceMediaRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await serviceMediaEndpoints.byService(serviceId);
      setMedia(data.data);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'تعذر تحميل صور الخدمة.');
    } finally {
      setIsLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const addMedia = useCallback(
    async (mediaUrl: string) => {
      setError(null);
      try {
        await serviceMediaEndpoints.create({
          service_id: serviceId,
          media_url: mediaUrl,
          media_type: 'IMAGE',
          is_main: media.length === 0,
        });
        await load();
        return true;
      } catch (err) {
        setError(err instanceof ApiException ? err.message : 'تعذر إضافة الصورة.');
        return false;
      }
    },
    [serviceId, media.length, load],
  );

  const setMain = useCallback(
    async (mediaId: number) => {
      setError(null);
      try {
        await serviceMediaEndpoints.update(mediaId, { is_main: true });
        await load();
      } catch (err) {
        setError(err instanceof ApiException ? err.message : 'تعذر تحديث الصورة الرئيسية.');
      }
    },
    [load],
  );

  const removeMedia = useCallback(
    async (mediaId: number) => {
      setError(null);
      const previous = media;
      setMedia((current) => current.filter((item) => item.media_id !== mediaId));
      try {
        await serviceMediaEndpoints.remove(mediaId);
      } catch (err) {
        setMedia(previous);
        setError(err instanceof ApiException ? err.message : 'تعذر حذف الصورة.');
      }
    },
    [media],
  );

  return { media, isLoading, error, addMedia, setMain, removeMedia };
}
