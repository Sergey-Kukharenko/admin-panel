import { apiClient } from '@/shared/api';

import type { ProductRun } from '../model/api';

export const productRunApi = {
  /** Получить прогон продукта по ID */
  getProductRun(productRunId: string) {
    return apiClient.get<ProductRun>(`/product-runs/${productRunId}`);
  },
};
