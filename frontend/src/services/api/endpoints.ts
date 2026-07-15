import { apiClient } from '@/services/api/client';
import {
  AUTH_ENDPOINTS,
  SERVICE_ENDPOINTS,
  PHOTOGRAPHER_ENDPOINTS,
  BOOKING_ENDPOINTS,
} from '@/constants/api';

import type { ApiSuccessResponse } from '@/types/api';
import type { ServiceRecord } from '@/types/service';
import type { PhotographerDetailsRecord } from '@/types/photographer';
import type {
  Booking,
  BookingCreatePayload,
} from '@/types/booking';

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
 * Raw HTTP calls for the generic Service resource.
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

/**
 * Raw HTTP calls for booking resources.
 */
export const bookingEndpoints = {
  create: (payload: BookingCreatePayload) =>
    apiClient.post<ApiSuccessResponse<Booking>>(
      BOOKING_ENDPOINTS.CREATE,
      payload,
    ),

  list: () =>
    apiClient.get<ApiSuccessResponse<Booking[]>>(
      BOOKING_ENDPOINTS.LIST,
    ),

  details: (bookingId: number | string) =>
    apiClient.get<ApiSuccessResponse<Booking>>(
      BOOKING_ENDPOINTS.DETAILS(bookingId),
    ),

  byCustomer: (customerProfileId: number | string) =>
    apiClient.get<ApiSuccessResponse<Booking[]>>(
      BOOKING_ENDPOINTS.BY_CUSTOMER(customerProfileId),
    ),
};

/**
 * Raw HTTP calls for the PhotographerDetails resource.
 */
export const photographerEndpoints = {
  list: () =>
    apiClient.get<ApiSuccessResponse<PhotographerDetailsRecord[]>>(
      PHOTOGRAPHER_ENDPOINTS.LIST,
    ),

  byService: (serviceId: number | string) =>
    apiClient.get<ApiSuccessResponse<PhotographerDetailsRecord>>(
      PHOTOGRAPHER_ENDPOINTS.BY_SERVICE(serviceId),
    ),
};