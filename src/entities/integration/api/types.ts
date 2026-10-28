import type { components, operations } from '@/shared/api';

type Schemas = components['schemas'];

/** Connection request status; not_configured is virtual: there is no active request */
export type IntegrationStatus = Schemas['IntegrationStatus'];

/** Environment in the API (dev / prod); in the UI — production / development, see IntegrationEnvironment */
export type AuthentikApiAccessEnvironment = Schemas['IntegrationEnvironment'];

export type ApiAccessType = Schemas['IntegrationAccessType'];

/** Request state — the shared part of GET /project-api-credentials and GET /project-s3-credentials */
export type IntegrationRequestState = Schemas['IntegrationOverviewResponseSchema'];

/** GET /project-api-credentials: request state and the project credentials (items) */
export type ProjectApiCredentialsOverview = Schemas['ProjectApiCredentialsOverviewResponseSchema'];

/** 201 response of POST /project-api-credentials/request and POST /project-s3-credentials/request */
export type IntegrationRequestCreated = Schemas['IntegrationRequestResponseSchema'];

/** POST /project-api-credentials/request body; the backend takes the organization and user from the session */
export type RestApiConnectionRequest = Schemas['ProjectApiCredentialRequestCreateSchema'];

/** POST /project-s3-credentials/request body */
export type S3ConnectionRequest = Schemas['ProjectS3CredentialRequestCreateSchema'];

export type ProjectApiCredential = Schemas['ProjectApiCredentialResponseSchema'];

export type ProjectApiCredentialRotateSecretResponse =
  Schemas['ProjectApiCredentialRotateSecretResponseSchema'];

export type ProjectApiCredentialLogItem = Schemas['ProjectApiCredentialLogItemSchema'];

export type ProjectApiCredentialLogsFilters = NonNullable<
  operations['list_project_api_credential_logs']['parameters']['query']
>;

export type ProjectApiCredentialLogsResponse = Schemas['ProjectApiCredentialLogsResponseSchema'];

// TODO: GET /project-api-credentials/scopes is not in OpenAPI yet — hand-written types until the backend adds it
export interface ProjectApiCredentialScope {
  scope_name: string;
  name: string | null;
}

export interface ProjectApiCredentialScopesCatalogue {
  items: ProjectApiCredentialScope[];
}
