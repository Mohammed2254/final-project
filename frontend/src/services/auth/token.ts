import { localStorageService } from '@/services/storage/localStorage';
import type { Account, ProviderProfile, UserProfile } from '@/types/auth';

const ACCESS_TOKEN_KEY = 'farah.accessToken';
const REFRESH_TOKEN_KEY = 'farah.refreshToken';
const ACCOUNT_KEY = 'farah.account';
const USER_PROFILE_KEY = 'farah.userProfile';
const PROVIDER_PROFILE_KEY = 'farah.providerProfile';

/**
 * Centralizes everything about where auth tokens live. The backend
 * currently only returns an access token; the refresh-token helpers are
 * kept in place so wiring in a real refresh flow later is a one-file change.
 */
export const tokenService = {
  getAccessToken(): string | null {
    return localStorageService.getRaw(ACCESS_TOKEN_KEY);
  },

  setAccessToken(token: string): void {
    localStorageService.setRaw(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken(): string | null {
    return localStorageService.getRaw(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token: string): void {
    localStorageService.setRaw(REFRESH_TOKEN_KEY, token);
  },

  getAccount(): Account | null {
    return localStorageService.get<Account>(ACCOUNT_KEY);
  },

  setAccount(account: Account): void {
    localStorageService.set<Account>(ACCOUNT_KEY, account);
  },

  getUserProfile(): UserProfile | null {
    return localStorageService.get<UserProfile>(USER_PROFILE_KEY);
  },

  setUserProfile(profile: UserProfile): void {
    localStorageService.set<UserProfile>(USER_PROFILE_KEY, profile);
  },

  getProviderProfile(): ProviderProfile | null {
    return localStorageService.get<ProviderProfile>(PROVIDER_PROFILE_KEY);
  },

  setProviderProfile(profile: ProviderProfile): void {
    localStorageService.set<ProviderProfile>(PROVIDER_PROFILE_KEY, profile);
  },

  clear(): void {
    localStorageService.remove(ACCESS_TOKEN_KEY);
    localStorageService.remove(REFRESH_TOKEN_KEY);
    localStorageService.remove(ACCOUNT_KEY);
    localStorageService.remove(USER_PROFILE_KEY);
    localStorageService.remove(PROVIDER_PROFILE_KEY);
  },
};
