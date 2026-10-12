import { apiClient } from '@/shared/api';

import type { IntegrationRequestCreated, IntegrationRequestState } from '../model/api';
import type { RestApiConnectionRequest, S3ConnectionRequest } from '../model/connectionRequest';

// Заявки на подключение интеграций (RFC Ph-1 API и S3). Организацию, проект и пользователя
// бэкенд берёт из сессии
export const integrationRequestApi = {
  /** Статус заявки на REST API; ответ также содержит items (ключи), в Ph-1 они не используются */
  getRestApiState() {
    return apiClient.get<IntegrationRequestState>('/project-api-credentials');
  },

  /** Отправить заявку на подключение REST API; 409 — активная заявка уже есть */
  requestRestApi(payload: RestApiConnectionRequest) {
    return apiClient.post<IntegrationRequestCreated>('/project-api-credentials/request', payload);
  },

  /** Статус заявки на S3 */
  getS3State() {
    return apiClient.get<IntegrationRequestState>('/project-s3-credentials');
  },

  /** Отправить заявку на подключение S3; 409 — активная заявка уже есть */
  requestS3(payload: S3ConnectionRequest) {
    return apiClient.post<IntegrationRequestCreated>('/project-s3-credentials/request', payload);
  },
};
