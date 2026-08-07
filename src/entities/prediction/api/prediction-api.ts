import { apiClient } from '@/shared/api';

import type { PredictionFilters, PredictionResultListResponse } from '../model/api';

export const predictionApi = {
  /** Получить список результатов прогнозов по проекту */
  getPredictions(params?: PredictionFilters, signal?: AbortSignal) {
    return apiClient.get<PredictionResultListResponse>('/predictions', {
      params,
      signal,
    });
  },

  /** Скачать файл результата прогноза */
  downloadPrediction(predictionResultId: string) {
    return apiClient.get<Blob>(`/predictions/${predictionResultId}/download`, {
      responseType: 'blob',
    });
  },
};
