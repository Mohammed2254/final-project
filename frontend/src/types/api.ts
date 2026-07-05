/**
 * The backend always responds with a consistent envelope
 * (see back end/app/utils/response_helper.py):
 *
 *   Success -> { success: true,  message, data }
 *   Error   -> { success: false, message, errors }
 */

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]> | string[] | null;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Normalized error shape thrown by the service layer so hooks/components
 * never need to know about Axios or the raw envelope.
 */
export class ApiException extends Error {
  status?: number;
  fieldErrors?: Record<string, string[]>;

  constructor(message: string, status?: number, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}
