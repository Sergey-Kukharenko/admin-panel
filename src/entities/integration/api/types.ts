import type { components, operations } from '@/shared/api';

type Schemas = components['schemas'];

/** Статус заявки на подключение; not_configured — виртуальный: активной заявки нет */
export type IntegrationStatus = Schemas['IntegrationStatus'];

/** Окружение в API (dev / prod); в UI — production / development, см. IntegrationEnvironment */
export type AuthentikApiAccessEnvironment = Schemas['IntegrationEnvironment'];

export type ApiAccessType = Schemas['IntegrationAccessType'];

/** Состояние заявки — общая часть ответов GET /project-api-credentials и GET /project-s3-credentials */
export type IntegrationRequestState = Schemas['IntegrationOverviewResponseSchema'];

/** GET /project-api-credentials: состояние заявки и ключи (items) */
export type ProjectApiCredentialsOverview = Schemas['ProjectApiCredentialsOverviewResponseSchema'];

/** Ответ 201 на POST /project-api-credentials/request и POST /project-s3-credentials/request */
export type IntegrationRequestCreated = Schemas['IntegrationRequestResponseSchema'];

/** Тело POST /project-api-credentials/request; организацию и пользователя бэкенд берёт из сессии */
export type RestApiConnectionRequest = Schemas['ProjectApiCredentialRequestCreateSchema'];

/** Тело POST /project-s3-credentials/request */
export type S3ConnectionRequest = Schemas['ProjectS3CredentialRequestCreateSchema'];

export type ProjectApiCredential = Schemas['ProjectApiCredentialResponseSchema'];

export type ProjectApiCredentialRotateSecretResponse =
  Schemas['ProjectApiCredentialRotateSecretResponseSchema'];

export type ProjectApiCredentialLogItem = Schemas['ProjectApiCredentialLogItemSchema'];

export type ProjectApiCredentialLogsFilters = NonNullable<
  operations['list_project_api_credential_logs']['parameters']['query']
>;

export type ProjectApiCredentialLogsResponse = Schemas['ProjectApiCredentialLogsResponseSchema'];

// TODO: эндпоинта GET /project-api-credentials/scopes в OpenAPI нет — типы ручные, ждём бэкенд
export interface ProjectApiCredentialScope {
  scope_name: string;
  name: string | null;
}

export interface ProjectApiCredentialScopesCatalogue {
  items: ProjectApiCredentialScope[];
}
