/** Mirrors the backend envelope in `back end/app/utils/response_helper.py`. */

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

/** Thrown by the service layer so hooks never have to know about Axios. */
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
