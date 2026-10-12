import type { IntegrationStatus } from './types';

export type AuthentikApiAccessEnvironment = 'dev' | 'prod';

/** Состояние заявки на подключение — общая часть ответов GET /project-api-credentials и GET /project-s3-credentials */
export interface IntegrationRequestState {
  status: IntegrationStatus;
  integration_request_id: string | null;
  requested_at: string | null;
  connected_at: string | null;
}

/** Ответ 201 на POST /project-api-credentials/request и POST /project-s3-credentials/request */
export interface IntegrationRequestCreated {
  integration_request_id: string;
  status: IntegrationStatus;
  environments: AuthentikApiAccessEnvironment[];
  created_at: string;
}

export interface ProjectApiCredential {
  project_api_credential_id: string;
  client_id: string;
  environment: AuthentikApiAccessEnvironment;
  scopes: string[];
}

export interface ProjectApiCredentialRotateSecretResponse extends ProjectApiCredential {
  client_secret: string;
}

export interface ProjectApiCredentialScope {
  scope_name: string;
  name: string | null;
}

export interface ProjectApiCredentialScopesCatalogue {
  items: ProjectApiCredentialScope[];
}

export interface ProjectApiCredentialLogItem {
  pk?: string | null;
  action?: string | null;
  app?: string | null;
  client_ip?: string | null;
  context?: Record<string, unknown> | null;
  created?: string | null;
  [key: string]: unknown;
}

export interface ProjectApiCredentialLogsFilters {
  page?: number;
  page_size?: number;
  search?: string;
  created_after?: string;
  created_before?: string;
}

export interface ProjectApiCredentialLogsResponse {
  items: ProjectApiCredentialLogItem[];
  total_count: number;
  next_page: number | null;
}
