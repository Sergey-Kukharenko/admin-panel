import type { components, operations } from '@/shared/api';

type Schemas = components['schemas'];

/** GET /user/me */
export type UserProfile = Schemas['AuthorizationMeResponseSchema'];

export type AuthorizationFrontend = NonNullable<
  NonNullable<operations['get_authorization_login_url']['parameters']['query']>['frontend']
>;

export type AuthorizationLoginUrlResponse = Schemas['AuthorizationLoginUrlSchema'];

/**
 * By OpenAPI the body is empty: the backend closes the portal session and Authentik SSO itself.
 * The API is not final yet, so an IdP logout link is still honoured if the backend returns one
 */
export type LogoutResponse = Schemas['LogoutResponse'] & {
  authentik_logout_url?: string | null;
};
