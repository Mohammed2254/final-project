import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

/**
 * Wrap any route (or route group) that should only be reachable while
 * logged in. Not wired into AppRouter yet since the pages it would guard
 * (Dashboard, Profile, ...) are out of scope for this sprint - ready for
 * Sprint 9 to consume as-is.
 */
export default function AuthGuard() {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) return null;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
