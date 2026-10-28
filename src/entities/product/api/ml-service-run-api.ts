import { apiClient } from '@/shared/api';

import type { MLServiceRun, MLServiceRunFilters, MLServiceRunListResponse } from './types';

export const mlServiceRunApi = {
  /** Получить список прогонов ML-сервисов проекта (включая processing / error) */
  getMLServiceRuns(params?: MLServiceRunFilters, signal?: AbortSignal) {
    return apiClient.get<MLServiceRunListResponse>('/ml-service-runs', { params, signal });
  },

  /** Получить прогон ML-сервиса по ID */
  getMLServiceRun(mlServiceRunId: string) {
    return apiClient.get<MLServiceRun>(`/ml-service-runs/${mlServiceRunId}`);
  },
};
