/**
 * Types shared across the app for authentication & account data.
 * These mirror the backend contracts exposed under /api/auth.
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

export interface AuthSession {
  accessToken: string;
  account: Account;
  fullName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface CustomerRegisterPayload {
  full_name: string;
  email: string;
  password: string;
}

export interface ProviderRegisterPayload {
  business_name: string;
  description?: string | null;
  phone_number: string;
  logo_path?: string | null;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface LoginResponseData {
  access_token: string;
  role: AccountRole;
  account: Account;
  user_profile?: UserProfile;
  provider_profile?: ProviderProfile;
}

export interface CustomerRegisterResponseData {
  access_token: string;
  account: Account;
  user_profile: UserProfile;
}

export interface ProviderRegisterResponseData {
  access_token: string;
  account: Account;
  provider_profile: ProviderProfile;
}
