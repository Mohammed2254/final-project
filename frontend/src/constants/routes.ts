export const ROUTES = {
  HOME: '/',
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

  PAYMENTS: '/payments',
  PROVIDER_DASHBOARD: '/provider/dashboard',

  NOT_FOUND: '/404',
} as const;