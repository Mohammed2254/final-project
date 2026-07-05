import { useState } from 'react';

import { authService } from '@/features/auth/services/auth.service';
import { ApiException } from '@/types/api';
import type { CustomerRegisterPayload } from '@/types/auth';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (payload: CustomerRegisterPayload): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.registerCustomer(payload);
      return true;
    } catch (err) {
      setError(
        err instanceof ApiException
          ? err.message
          : 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.',
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}
