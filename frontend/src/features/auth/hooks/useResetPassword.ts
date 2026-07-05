import { useState } from 'react';

import { authService } from '@/features/auth/services/auth.service';
import { ApiException } from '@/types/api';
import type { ResetPasswordPayload } from '@/types/auth';

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (payload: ResetPasswordPayload): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword(payload);
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

  return { submit, isLoading, error };
}
