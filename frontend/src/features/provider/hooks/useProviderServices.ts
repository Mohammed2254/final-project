import { useCallback, useEffect, useState } from 'react';

import { providerDashboardService } from '@/features/provider/services/provider-dashboard.service';
import type { ProviderServiceFormValues } from '@/features/provider/schemas/provider-service.schema';
import { ApiException } from '@/types/api';
import type { ServiceItem } from '@/types/service';

export function useProviderServices(providerProfileId?: number) {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    if (!providerProfileId) return;

    setIsLoading(true);
    setError(null);
    try {
      const items = await providerDashboardService.listServices(providerProfileId);
      setServices(items);
    } catch (err) {
      setError(
        err instanceof ApiException
          ? err.message
          : 'تعذر تحميل خدمات مقدم الخدمة.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [providerProfileId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadServices();
  }, [loadServices]);

  const createService = async (values: ProviderServiceFormValues) => {
    if (!providerProfileId) {
      setError('لم يتم العثور على ملف مقدم الخدمة. سجل الدخول مرة أخرى.');
      return false;
    }

    setIsCreating(true);
    setError(null);
    try {
      const item = await providerDashboardService.createService(providerProfileId, values);
      setServices((current) => [item, ...current]);
      return true;
    } catch (err) {
      setError(
        err instanceof ApiException
          ? err.message
          : 'تعذر إنشاء الخدمة. تحقق من البيانات وحاول مرة أخرى.',
      );
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    services,
    isLoading,
    isCreating,
    error,
    createService,
    reload: loadServices,
  };
}
