import { useNavigate } from 'react-router-dom';

import { authService } from '@/features/auth/services/auth.service';

export function useLogout() {
  const navigate = useNavigate();

  const logout = () => {
    authService.logout();
    navigate('/auth/login', { replace: true });
  };

  return { logout };
}
