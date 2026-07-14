import { useState } from 'react';

import { authService } from '@/features/auth/services/auth.service';
import type { ProviderRegisterPayload } from '@/types/auth';

export function useRegisterProvider() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerProvider = async (
    payload: ProviderRegisterPayload,
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.registerProvider(payload);

      return true;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'تعذر إنشاء حساب مقدم الخدمة.',
      );

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerProvider,
    isLoading,
    error,
  };
}