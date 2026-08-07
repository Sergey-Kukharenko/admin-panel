import { apiClient } from '@/shared/api';

import type { MLServiceRun } from '../model/api';

export const mlServiceRunApi = {
  /** Получить прогон ML-сервиса по ID */
  getMLServiceRun(mlServiceRunId: string) {
    return apiClient.get<MLServiceRun>(`/ml-service-runs/${mlServiceRunId}`);
  },
};
