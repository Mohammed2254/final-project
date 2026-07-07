import { useCallback, useEffect, useState } from 'react';

import { serviceEndpoints } from '@/services/api/endpoints';
import { toServiceItem, type ServiceItem } from '@/types/service';
import { ApiException } from '@/types/api';

/**
 * Backs the Home page's "Featured Halls" and "Featured Services"
 * sections. The backend only exposes one generic, active-services list
 * (no category names, no "featured" flag), so both sections currently
 * read from the same fetch and are split client-side - see the Home
 * page's TODO comment for what's needed to split them properly once
 * category data is available.
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
      setServices(data.data.filter((record) => record.is_active).map(toServiceItem));
    } catch (err) {
      setError(
        err instanceof ApiException ? err.message : 'تعذر تحميل البيانات، يرجى المحاولة مرة أخرى.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Standard fetch-on-mount: fetchServices sets loading/data/error state,
    // which is the intended effect here (not a derived-state anti-pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchServices();
  }, [fetchServices]);

  return { services, isLoading, error, reload: fetchServices };
}