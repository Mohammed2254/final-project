export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'http://localhost:5000/api';

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER_CUSTOMER: '/auth/register/customer',
  REGISTER_PROVIDER: '/auth/register/provider',

  // غير منفذة في الباك إند حاليًا.
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
} as const;

export const SERVICE_ENDPOINTS = {
  LIST: '/services/',
  CREATE: '/services/',
  DETAILS: (id: number | string) => `/services/${id}`,
  BY_CATEGORY: (categoryId: number | string) =>
    `/services/category/${categoryId}`,
  BY_PROVIDER: (providerProfileId: number | string) =>
    `/services/provider/${providerProfileId}`,
  SEARCH: '/services/search',
} as const;

export const SERVICE_CATEGORY_ENDPOINTS = {
  LIST: '/service-categories/',
} as const;

export const HALL_ENDPOINTS = {
  CREATE: '/halls/',
  BY_SERVICE: (serviceId: number | string) => `/halls/service/${serviceId}`,
} as const;

export const PHOTOGRAPHER_ENDPOINTS = {
  LIST: '/photographers/',
  CREATE: '/photographers/',
  BY_SERVICE: (serviceId: number | string) => `/photographers/service/${serviceId}`,
} as const;

export const SERVICE_MEDIA_ENDPOINTS = {
  CREATE: '/service-media/',
  BY_SERVICE: (serviceId: number | string) => `/service-media/service/${serviceId}`,
  MAIN_BY_SERVICE: (serviceId: number | string) => `/service-media/service/${serviceId}/main`,
} as const;

export const BOOKING_ENDPOINTS = {
  CREATE: '/bookings/',
  LIST: '/bookings/',
  DETAILS: (bookingId: number | string) =>
    `/bookings/${bookingId}`,
  BY_CUSTOMER: (customerProfileId: number | string) =>
    `/bookings/customer/${customerProfileId}`,
} as const;

export const FAVORITE_ENDPOINTS = {
  LIST: '/favorites/',
  CREATE: '/favorites/',
  DELETE: (serviceId: number | string) => `/favorites/${serviceId}`,
} as const;
