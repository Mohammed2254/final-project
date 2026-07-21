import { apiClient } from '@/services/api/client';
import {
  AUTH_ENDPOINTS,
  SERVICE_ENDPOINTS,
  SERVICE_CATEGORY_ENDPOINTS,
  HALL_ENDPOINTS,
  PHOTOGRAPHER_ENDPOINTS,
  SERVICE_MEDIA_ENDPOINTS,
  BOOKING_ENDPOINTS,
  FAVORITE_ENDPOINTS,
  WEDDING_PLAN_ENDPOINTS,
  WEDDING_PLAN_INVITATION_ENDPOINTS,
  WEDDING_PLAN_SELECTION_ENDPOINTS,
} from '@/constants/api';

import type { ApiSuccessResponse } from '@/types/api';
import type {
  HallDetailsCreatePayload,
  HallDetailsRecord,
  PhotographerDetailsCreatePayload,
  ServiceCategoryRecord,
  ServiceCreatePayload,
  ServiceMediaCreatePayload,
  ServiceMediaRecord,
  ServiceMediaUpdatePayload,
  ServiceRecord,
} from '@/types/service';
import type { PhotographerDetailsRecord } from '@/types/photographer';
import type {
  Booking,
  BookingCreatePayload,
  BookingStatus,
} from '@/types/booking';
import type {
  FavoriteCreatePayload,
  FavoriteRecord,
} from '@/types/favorite';
import type {
  WeddingPlanCreatePayload,
  WeddingPlanRecord,
  WeddingPlanInvitationCreatePayload,
  WeddingPlanInvitationRecord,
  WeddingPlanSelectionCreatePayload,
  WeddingPlanSelectionRecord,
} from '@/types/weddingPlan';

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

  create: (payload: ServiceCreatePayload) =>
    apiClient.post<ApiSuccessResponse<ServiceRecord>>(
      SERVICE_ENDPOINTS.CREATE,
      payload,
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

export const serviceCategoryEndpoints = {
  list: () =>
    apiClient.get<ApiSuccessResponse<ServiceCategoryRecord[]>>(
      SERVICE_CATEGORY_ENDPOINTS.LIST,
    ),
};

export const hallEndpoints = {
  list: () =>
    apiClient.get<ApiSuccessResponse<HallDetailsRecord[]>>(
      HALL_ENDPOINTS.LIST,
    ),

  create: (payload: HallDetailsCreatePayload) =>
    apiClient.post<ApiSuccessResponse<HallDetailsRecord>>(
      HALL_ENDPOINTS.CREATE,
      payload,
    ),

  byService: (serviceId: number | string) =>
    apiClient.get<ApiSuccessResponse<HallDetailsRecord>>(
      HALL_ENDPOINTS.BY_SERVICE(serviceId),
    ),
};

/**
 * Raw HTTP calls for booking resources. Identity (customer/provider) is
 * always derived server-side from the JWT (see booking_routes.py).
 */
export const bookingEndpoints = {
  create: (payload: BookingCreatePayload) =>
    apiClient.post<ApiSuccessResponse<Booking>>(
      BOOKING_ENDPOINTS.CREATE,
      payload,
    ),

  details: (bookingId: number | string) =>
    apiClient.get<ApiSuccessResponse<Booking>>(
      BOOKING_ENDPOINTS.DETAILS(bookingId),
    ),

  mine: () =>
    apiClient.get<ApiSuccessResponse<Booking[]>>(
      BOOKING_ENDPOINTS.MINE,
    ),

  providerMine: () =>
    apiClient.get<ApiSuccessResponse<Booking[]>>(
      BOOKING_ENDPOINTS.PROVIDER_MINE,
    ),

  updateStatus: (bookingId: number | string, status: BookingStatus) =>
    apiClient.post<ApiSuccessResponse<Booking>>(
      BOOKING_ENDPOINTS.UPDATE_STATUS(bookingId),
      { status },
    ),
};

/**
 * Raw HTTP calls for favorites - all require an authenticated Customer;
 * identity is derived server-side from the JWT (see favorite_routes.py).
 */
export const favoriteEndpoints = {
  list: () =>
    apiClient.get<ApiSuccessResponse<FavoriteRecord[]>>(
      FAVORITE_ENDPOINTS.LIST,
    ),

  add: (payload: FavoriteCreatePayload) =>
    apiClient.post<ApiSuccessResponse<FavoriteRecord>>(
      FAVORITE_ENDPOINTS.CREATE,
      payload,
    ),

  remove: (serviceId: number | string) =>
    apiClient.delete<ApiSuccessResponse<null>>(
      FAVORITE_ENDPOINTS.DELETE(serviceId),
    ),
};

/**
 * Raw HTTP calls for the shared wedding plan (owner + optional partner).
 * Identity for owner/added_by is always derived server-side from the JWT
 * (see wedding_plan_routes.py / wedding_plan_selection_routes.py) - never
 * sent from the client.
 */
export const weddingPlanEndpoints = {
  create: (payload: WeddingPlanCreatePayload) =>
    apiClient.post<ApiSuccessResponse<WeddingPlanRecord>>(
      WEDDING_PLAN_ENDPOINTS.CREATE,
      payload,
    ),

  mine: () =>
    apiClient.get<ApiSuccessResponse<WeddingPlanRecord[]>>(
      WEDDING_PLAN_ENDPOINTS.MINE,
    ),

  details: (planId: number | string) =>
    apiClient.get<ApiSuccessResponse<WeddingPlanRecord>>(
      WEDDING_PLAN_ENDPOINTS.DETAILS(planId),
    ),

  remove: (planId: number | string) =>
    apiClient.delete<ApiSuccessResponse<null>>(
      WEDDING_PLAN_ENDPOINTS.DELETE(planId),
    ),
};

export const weddingPlanInvitationEndpoints = {
  create: (payload: WeddingPlanInvitationCreatePayload) =>
    apiClient.post<ApiSuccessResponse<WeddingPlanInvitationRecord>>(
      WEDDING_PLAN_INVITATION_ENDPOINTS.CREATE,
      payload,
    ),

  accept: (inviteCode: string) =>
    apiClient.post<ApiSuccessResponse<WeddingPlanInvitationRecord>>(
      WEDDING_PLAN_INVITATION_ENDPOINTS.ACCEPT,
      { invite_code: inviteCode },
    ),

  reject: (inviteCode: string) =>
    apiClient.post<ApiSuccessResponse<WeddingPlanInvitationRecord>>(
      WEDDING_PLAN_INVITATION_ENDPOINTS.REJECT,
      { invite_code: inviteCode },
    ),
};

export const weddingPlanSelectionEndpoints = {
  create: (payload: WeddingPlanSelectionCreatePayload) =>
    apiClient.post<ApiSuccessResponse<WeddingPlanSelectionRecord>>(
      WEDDING_PLAN_SELECTION_ENDPOINTS.CREATE,
      payload,
    ),

  byPlan: (planId: number | string) =>
    apiClient.get<ApiSuccessResponse<WeddingPlanSelectionRecord[]>>(
      WEDDING_PLAN_SELECTION_ENDPOINTS.BY_PLAN(planId),
    ),

  remove: (planServiceId: number | string) =>
    apiClient.delete<ApiSuccessResponse<null>>(
      WEDDING_PLAN_SELECTION_ENDPOINTS.DELETE(planServiceId),
    ),

  approve: (planServiceId: number | string) =>
    apiClient.post<ApiSuccessResponse<WeddingPlanSelectionRecord>>(
      WEDDING_PLAN_SELECTION_ENDPOINTS.APPROVE(planServiceId),
      {},
    ),

  reject: (planServiceId: number | string) =>
    apiClient.post<ApiSuccessResponse<WeddingPlanSelectionRecord>>(
      WEDDING_PLAN_SELECTION_ENDPOINTS.REJECT(planServiceId),
      {},
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

  create: (payload: PhotographerDetailsCreatePayload) =>
    apiClient.post<ApiSuccessResponse<PhotographerDetailsRecord>>(
      PHOTOGRAPHER_ENDPOINTS.CREATE,
      payload,
    ),

  byService: (serviceId: number | string) =>
    apiClient.get<ApiSuccessResponse<PhotographerDetailsRecord>>(
      PHOTOGRAPHER_ENDPOINTS.BY_SERVICE(serviceId),
    ),
};

export const serviceMediaEndpoints = {
  create: (payload: ServiceMediaCreatePayload) =>
    apiClient.post<ApiSuccessResponse<ServiceMediaRecord>>(
      SERVICE_MEDIA_ENDPOINTS.CREATE,
      payload,
    ),

  byService: (serviceId: number | string) =>
    apiClient.get<ApiSuccessResponse<ServiceMediaRecord[]>>(
      SERVICE_MEDIA_ENDPOINTS.BY_SERVICE(serviceId),
    ),

  mainByService: (serviceId: number | string) =>
    apiClient.get<ApiSuccessResponse<ServiceMediaRecord>>(
      SERVICE_MEDIA_ENDPOINTS.MAIN_BY_SERVICE(serviceId),
    ),

  update: (mediaId: number | string, payload: ServiceMediaUpdatePayload) =>
    apiClient.put<ApiSuccessResponse<ServiceMediaRecord>>(
      SERVICE_MEDIA_ENDPOINTS.UPDATE(mediaId),
      payload,
    ),

  remove: (mediaId: number | string) =>
    apiClient.delete<ApiSuccessResponse<null>>(
      SERVICE_MEDIA_ENDPOINTS.DELETE(mediaId),
    ),
};
