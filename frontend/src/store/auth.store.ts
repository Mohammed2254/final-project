import { createStore } from '@/store/createStore';
import { tokenService } from '@/services/auth/token';
import { UNAUTHORIZED_EVENT } from '@/services/api/interceptors';
import type { Account, ProviderProfile, UserProfile } from '@/types/auth';

interface AuthState {
  account: Account | null;
  userProfile: UserProfile | null;
  providerProfile: ProviderProfile | null;
  isAuthenticated: boolean;
  /** false until we've checked localStorage once, so guards don't flash-redirect */
  isInitialized: boolean;
}

const storedAccount = tokenService.getAccount();
const storedToken = tokenService.getAccessToken();
const storedUserProfile = tokenService.getUserProfile();
const storedProviderProfile = tokenService.getProviderProfile();

export const authStore = createStore<AuthState>({
  account: storedAccount && storedToken ? storedAccount : null,
  userProfile: storedAccount && storedToken ? storedUserProfile : null,
  providerProfile: storedAccount && storedToken ? storedProviderProfile : null,
  isAuthenticated: Boolean(storedAccount && storedToken),
  isInitialized: true,
});

export const authActions = {
  login(
    account: Account,
    accessToken: string,
    profiles: {
      userProfile?: UserProfile;
      providerProfile?: ProviderProfile;
    } = {},
  ): void {
    tokenService.setAccessToken(accessToken);
    tokenService.setAccount(account);

    if (profiles.userProfile) {
      tokenService.setUserProfile(profiles.userProfile);
    }

    if (profiles.providerProfile) {
      tokenService.setProviderProfile(profiles.providerProfile);
    }

    authStore.setState({
      account,
      userProfile: profiles.userProfile ?? null,
      providerProfile: profiles.providerProfile ?? null,
      isAuthenticated: true,
    });
  },

  logout(): void {
    tokenService.clear();
    authStore.setState({
      account: null,
      userProfile: null,
      providerProfile: null,
      isAuthenticated: false,
    });
  },
};

// Any 401 from the API means the session is no longer valid - drop it so
// guards redirect to /auth/login automatically.
window.addEventListener(UNAUTHORIZED_EVENT, () => {
  if (authStore.getState().isAuthenticated) {
    authActions.logout();
  }
});
