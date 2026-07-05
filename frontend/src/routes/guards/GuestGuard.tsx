import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

/**
 * Wraps the auth routes (login/register/forgot/reset password). If the
 * person is already logged in, sends them home instead of showing the
 * login screen again.
 */
export default function GuestGuard() {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) return null;

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
}
