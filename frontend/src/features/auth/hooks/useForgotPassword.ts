import { useState } from 'react';

import { authService } from '@/features/auth/services/auth.service';
import { ApiException } from '@/types/api';
import type { ForgotPasswordPayload } from '@/types/auth';

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const submit = async (payload: ForgotPasswordPayload): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(payload);
      setIsSent(true);
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

  return { submit, isLoading, error, isSent };
}
