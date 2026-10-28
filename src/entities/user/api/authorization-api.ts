import { apiClient } from '@/shared/api';

export type AuthorizationFrontend = 'local' | 'main';

export interface AuthorizationLoginUrlResponse {
  authorize_url: string;
}

/**
 * По OpenAPI тело пустое: сессию портала и SSO в Authentik бэкенд закрывает сам. API ещё не
 * финализирован, поэтому ссылку на логаут IdP поддерживаем, если бэкенд её всё же вернёт
 */
export interface LogoutResponse {
  authentik_logout_url?: string | null;
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
