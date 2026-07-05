import { useState } from 'react';

import { authService } from '@/features/auth/services/auth.service';
import { ApiException } from '@/types/api';
import type { LoginPayload } from '@/types/auth';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: LoginPayload): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.login(payload);
      return true;
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
