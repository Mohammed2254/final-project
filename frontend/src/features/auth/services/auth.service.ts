import { authEndpoints } from '@/services/api/endpoints';
import { authActions } from '@/store/auth.store';
import type {
  LoginPayload,
  CustomerRegisterPayload,
  ProviderRegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '@/types/auth';

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await authEndpoints.login(payload);
    authActions.login(data.data.account, data.data.access_token, {
      userProfile: data.data.user_profile,
      providerProfile: data.data.provider_profile,
    });
    return data.data;
  },

  async registerCustomer(payload: CustomerRegisterPayload) {
    const { data } = await authEndpoints.registerCustomer(payload);
    authActions.login(data.data.account, data.data.access_token, {
      userProfile: data.data.user_profile,
    });
    return data.data;
  },

  async registerProvider(payload: ProviderRegisterPayload) {
  const { data } = await authEndpoints.registerProvider(payload);

  authActions.login(
    data.data.account,
    data.data.access_token,
    {
      providerProfile: data.data.provider_profile,
    },
  );

  return data.data;
},

  async forgotPassword(payload: ForgotPasswordPayload) {
    const { data } = await authEndpoints.forgotPassword(payload);
    return data.data;
  },

  async resetPassword(payload: ResetPasswordPayload) {
    const { data } = await authEndpoints.resetPassword(payload);
    return data.data;
  },

  logout(): void {
    authActions.logout();
  },
};
