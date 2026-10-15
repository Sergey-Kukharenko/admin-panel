import { apiClient } from '@/shared/api';

import type {
  AuthentikApiAccessEnvironment,
  ProjectApiCredential,
  ProjectApiCredentialLogsFilters,
  ProjectApiCredentialLogsResponse,
  ProjectApiCredentialRotateSecretResponse,
  ProjectApiCredentialScopesCatalogue,
  ProjectApiCredentialsOverview,
} from './types';

export const projectApiCredentialApi = {
  /** Получить статус интеграции и API-ключи текущего проекта (ключи — в items) */
  listCredentials() {
    return apiClient.get<ProjectApiCredentialsOverview>('/project-api-credentials');
  },

  /** Получить доступные кастомные OAuth-скоупы для окружения */
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

  /** Получить журнал выдачи токенов Authentik для API-ключа проекта */
  getLogs(projectApiCredentialId: string, params?: ProjectApiCredentialLogsFilters) {
    return apiClient.get<ProjectApiCredentialLogsResponse>(
      `/project-api-credentials/${projectApiCredentialId}/logs`,
      { params },
    );
  },
};
