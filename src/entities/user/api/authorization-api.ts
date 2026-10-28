import { apiClient } from '@/shared/api';

import type { AuthorizationFrontend, AuthorizationLoginUrlResponse, LogoutResponse } from './types';

export const authorizationApi = {
  /** OIDC authorize URL for interactive login (does not redirect) */
  getLoginUrl(frontend?: AuthorizationFrontend) {
    return apiClient.get<AuthorizationLoginUrlResponse>('/authorization/login-url', {
      params: frontend ? { frontend } : undefined,
    });
  },

  /** Invalidate portal session, revoke IdP tokens, clear session cookie */
  logout() {
    return apiClient.post<LogoutResponse>('/authorization/logout');
  },
};
