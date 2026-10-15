import { apiClient } from '@/shared/api';

import type { ProductRun } from './types';

export const productRunApi = {
  /** Получить прогон продукта по ID */
  getProductRun(productRunId: string) {
    return apiClient.get<ProductRun>(`/product-runs/${productRunId}`);
  },
};
