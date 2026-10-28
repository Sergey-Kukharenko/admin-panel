import { apiClient } from '@/shared/api';

import type {
  AuthentikApiAccessEnvironment,
  ProjectApiCredential,
  ProjectApiCredentialLogsFilters,
  ProjectApiCredentialLogsResponse,
  ProjectApiCredentialRotateSecretResponse,
  ProjectApiCredentialScopesCatalogue,
} from './types';

export const projectApiCredentialApi = {
  /** Получить доступные кастомные OAuth-скоупы для окружения.
   *  TODO: эндпоинта больше нет в OpenAPI — заготовка, не вызывать до появления на бэке */
  listScopes(environment: AuthentikApiAccessEnvironment) {
    return apiClient.get<ProjectApiCredentialScopesCatalogue>('/project-api-credentials/scopes', {
      params: { environment },
    });
  },

  /** Получить один API-ключ проекта */
  getCredential(projectApiCredentialId: string) {
    return apiClient.get<ProjectApiCredential>(
      `/project-api-credentials/${projectApiCredentialId}`,
    );
  },

  /** Сгенерировать новый client_secret для API-ключа проекта */
  rotateSecret(projectApiCredentialId: string) {
    return apiClient.post<ProjectApiCredentialRotateSecretResponse>(
      `/project-api-credentials/${projectApiCredentialId}/rotate-secret`,
    );
  },

  /** Authentik token-issuance log of a project API credential (paginated by page / page_size) */
  getLogs(
    projectApiCredentialId: string,
    params?: ProjectApiCredentialLogsFilters,
    signal?: AbortSignal,
  ) {
    return apiClient.get<ProjectApiCredentialLogsResponse>(
      `/project-api-credentials/${projectApiCredentialId}/logs`,
      { params, signal },
    );
  },
};
