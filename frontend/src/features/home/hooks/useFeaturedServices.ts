import { useCallback, useEffect, useState } from 'react';

import { serviceEndpoints } from '@/services/api/endpoints';
import { toServiceItem, type ServiceItem } from '@/types/service';
import { ApiException } from '@/types/api';
import { withMainImages } from '@/utils/attachServiceImages';

/**
 * The backend has no "featured" flag - it exposes one generic active-services
 * list, so both Home page sections read from this same fetch and split client-side.
 */
export function useFeaturedServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await serviceEndpoints.list();
      const items = data.data.filter((record) => record.is_active).map(toServiceItem);
      setServices(await withMainImages(items));
    } catch (err) {
      setError(
        err instanceof ApiException ? err.message : 'تعذر تحميل البيانات، يرجى المحاولة مرة أخرى.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchServices();
  }, [fetchServices]);

  return { services, isLoading, error, reload: fetchServices };
}