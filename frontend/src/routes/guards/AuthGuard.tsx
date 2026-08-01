import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

export default function AuthGuard() {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  // Render nothing until the stored token has been read, or a logged-in user
  // reloading a guarded page gets bounced to login for one frame.
  if (!isInitialized) return null;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
