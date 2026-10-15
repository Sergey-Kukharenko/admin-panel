import type { components, operations } from '@/shared/api';

type Schemas = components['schemas'];

/** GET /user/me */
export type UserProfile = Schemas['AuthorizationMeResponseSchema'];

export type AuthorizationFrontend = NonNullable<
  NonNullable<operations['get_authorization_login_url']['parameters']['query']>['frontend']
>;

export type AuthorizationLoginUrlResponse = Schemas['AuthorizationLoginUrlSchema'];

/**
 * По OpenAPI тело пустое: сессию портала и SSO в Authentik бэкенд закрывает сам. API ещё не
 * финализирован, поэтому ссылку на логаут IdP поддерживаем, если бэкенд её всё же вернёт
 */
export type LogoutResponse = Schemas['LogoutResponse'] & {
  authentik_logout_url?: string | null;
};
