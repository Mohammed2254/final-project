import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

export default function GuestGuard() {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) return null;

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
}
