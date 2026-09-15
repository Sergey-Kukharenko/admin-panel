import { apiClient } from './api-client';

export type AuthorizationFrontend = 'local' | 'main';

export interface AuthorizationLoginUrlResponse {
  authorize_url: string;
}

export interface LogoutResponse {
  authentik_logout_url: string | null;
}

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
