/**
 * Session shapes read by app-wide state (store/auth.store.ts) and by
 * anything outside the auth feature that needs to know who's logged in
 * (Header, guards, etc.). Request/response payloads for the login and
 * register flows live in features/auth/types.ts instead - nothing outside
 * that feature needs them.
 */

export type AccountRole = 'Customer' | 'Provider';

export interface Account {
  account_id: number;
  email: string;
  role: AccountRole;
}

export interface UserProfile {
  user_profile_id: number;
  full_name: string;
}

export interface ProviderProfile {
  provider_profile_id: number;
  business_name: string;
}
