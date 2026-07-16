import { useSyncExternalStore } from 'react';

import { authStore } from '@/store/auth.store';
import { authService } from '@/features/auth/services/auth.service';

export function useAuth() {
  const state = useSyncExternalStore(authStore.subscribe, authStore.getState, authStore.getState);

  return {
    account: state.account,
    userProfile: state.userProfile,
    providerProfile: state.providerProfile,
    isAuthenticated: state.isAuthenticated,
    isInitialized: state.isInitialized,
    logout: authService.logout,
  };
}
