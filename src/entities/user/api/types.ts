import type { components, operations } from '@/shared/api';

type Schemas = components['schemas'];

/**
 * GET /user/me.
 * TODO: WT-566 — `is_onboarding_complete` is agreed with the backend (2026-11-13) but is not in the
 * OpenAPI schema yet; drop the extension once `npm run api:types` brings the field
 */
export type UserProfile = Schemas['AuthorizationMeResponseSchema'] & {
  /** The client has received the first result; never reset afterwards (PM decision, 2026-11-03) */
  is_onboarding_complete?: boolean;
};

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
