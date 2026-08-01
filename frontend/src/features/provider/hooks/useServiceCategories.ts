import { useCallback, useEffect, useState } from 'react';

import { serviceCategoryEndpoints } from '@/services/api/endpoints';
import { ApiException } from '@/types/api';
import type { ServiceCategoryRecord } from '@/types/service';

export function useServiceCategories() {
  const [categories, setCategories] = useState<ServiceCategoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await serviceCategoryEndpoints.list();
      setCategories(data.data);
    } catch (err) {
      setError(
        err instanceof ApiException ? err.message : 'تعذر تحميل تصنيفات الخدمات.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, error, reload: fetchCategories };
}
