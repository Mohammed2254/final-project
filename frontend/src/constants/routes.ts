export const ROUTES = {
  /** Marketing page, shown to guests at the root. */
  LANDING: '/',
  /** The app itself - where a signed-in visitor starts. */
  HOME: '/home',
  ABOUT: '/about',

  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROVIDER_REGISTER: '/auth/register/provider',

  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  HALLS: '/halls',
  PHOTOGRAPHERS: '/photographers',
  WEDDING_PLANNER: '/planner',
  FAVORITES: '/favorites',

  BOOKING: (serviceId: number | string) =>
    `/booking/${serviceId}`,

  PAYMENT: (bookingId: number | string) =>
    `/payments/${bookingId}`,
  PAYMENT_CALLBACK: '/payments/callback',

  MY_BOOKINGS: '/my-bookings',
  PROVIDER_DASHBOARD: '/provider/dashboard',

  NOT_FOUND: '/404',
} as const;