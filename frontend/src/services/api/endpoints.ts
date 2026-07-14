import { apiClient } from '@/services/api/client';
import {
  AUTH_ENDPOINTS,
  SERVICE_ENDPOINTS,
} from '@/constants/api';
import type { ApiSuccessResponse } from '@/types/api';
import type { ServiceRecord } from '@/types/service';
import type {
  LoginPayload,
  CustomerRegisterPayload,
  ProviderRegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  LoginResponseData,
  CustomerRegisterResponseData,
  ProviderRegisterResponseData,
} from '@/types/auth';

/**
 * Raw HTTP calls only - no business logic, no storage side effects.
 * The feature-level auth.service.ts composes these.
 */
export const authEndpoints = {
  login: (payload: LoginPayload) =>
    apiClient.post<ApiSuccessResponse<LoginResponseData>>(
      AUTH_ENDPOINTS.LOGIN,
      payload,
    ),

  registerCustomer: (payload: CustomerRegisterPayload) =>
    apiClient.post<ApiSuccessResponse<CustomerRegisterResponseData>>(
      AUTH_ENDPOINTS.REGISTER_CUSTOMER,
      payload,
    ),

  registerProvider: (payload: ProviderRegisterPayload) =>
    apiClient.post<ApiSuccessResponse<ProviderRegisterResponseData>>(
      AUTH_ENDPOINTS.REGISTER_PROVIDER,
      payload,
    ),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiClient.post<ApiSuccessResponse<null>>(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      payload,
    ),

  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient.post<ApiSuccessResponse<null>>(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      payload,
    ),
};

/**
 * Raw HTTP calls for the generic Service resource. Halls, photographers,
 * and any future service category all go through this same backend
 * endpoint set - see back end/app/routes/service_routes.py.
 */
export const serviceEndpoints = {
  list: () =>
    apiClient.get<ApiSuccessResponse<ServiceRecord[]>>(
      SERVICE_ENDPOINTS.LIST,
    ),

  details: (id: number | string) =>
    apiClient.get<ApiSuccessResponse<ServiceRecord>>(
      SERVICE_ENDPOINTS.DETAILS(id),
    ),

  byCategory: (categoryId: number | string) =>
    apiClient.get<ApiSuccessResponse<ServiceRecord[]>>(
      SERVICE_ENDPOINTS.BY_CATEGORY(categoryId),
    ),

  byProvider: (providerProfileId: number | string) =>
    apiClient.get<ApiSuccessResponse<ServiceRecord[]>>(
      SERVICE_ENDPOINTS.BY_PROVIDER(providerProfileId),
    ),

  search: (keyword: string) =>
    apiClient.get<ApiSuccessResponse<ServiceRecord[]>>(
      SERVICE_ENDPOINTS.SEARCH,
      {
        params: { keyword },
      },
    ),
};