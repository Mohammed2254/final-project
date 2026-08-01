import type { Account, AccountRole, ProviderProfile, UserProfile } from '@/types/auth';

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
