import type { AxiosError } from 'axios';

import { apiClient } from '@/services/api/client';
import { tokenService } from '@/services/auth/token';
import { ApiException, type ApiErrorResponse } from '@/types/api';

/** Dispatched so the auth store can react without a circular import. */
export const UNAUTHORIZED_EVENT = 'farah:unauthorized';

let interceptorsAttached = false;

export function attachApiInterceptors(): void {
  if (interceptorsAttached) return;
  interceptorsAttached = true;

  apiClient.interceptors.request.use((config) => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
      const status = error.response?.status;
      const payload = error.response?.data;

      if (status === 401) {
        window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
      }

      const message = payload?.message ?? getFallbackMessage(status);
      const fieldErrors =
        payload?.errors && !Array.isArray(payload.errors) ? payload.errors : undefined;

      return Promise.reject(new ApiException(message, status, fieldErrors));
    },
  );
}

function getFallbackMessage(status?: number): string {
  if (!status) {
    return 'تعذر الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت.';
  }
  if (status >= 500) {
    return 'حدث خطأ غير متوقع في الخادم، يرجى المحاولة لاحقاً.';
  }
  return 'حدث خطأ ما، يرجى المحاولة مرة أخرى.';
}
