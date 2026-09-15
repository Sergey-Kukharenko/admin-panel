export type AuthentikApiAccessEnvironment = 'dev' | 'prod';

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
