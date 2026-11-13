import { apiClient } from '@/shared/api';

import type {
  Product,
  ProductChartResponse,
  ProductChartSlug,
  ProductRequiredFilesStatus,
} from './types';

export const productApi = {
  /** Получить список продуктов проекта */
  getProducts() {
    return apiClient.get<Product[]>('/products');
  },

  /** Получить продукт по ID */
  getProduct(productId: string) {
    return apiClient.get<Product>(`/products/${productId}`);
  },

  /** Получить статус готовности требуемых файлов продукта */
  getRequiredFilesStatus(productId: string) {
    return apiClient.get<ProductRequiredFilesStatus>(
      `/products/${productId}/required-files/status`,
    );
  },

  /** Отправить в Slack уведомление о готовности требуемых файлов продукта */
  notifyRequiredFilesReady(productId: string) {
    return apiClient.post<ProductRequiredFilesStatus>(
      `/products/${productId}/required-files/notify`,
    );
  },

  /**
   * Daily results of the product's ML services for the last 30 days (dashboard chart);
   * 404 — the product is not connected to the project
   */
  getProductChart(productSlug: ProductChartSlug, signal?: AbortSignal) {
    return apiClient.get<ProductChartResponse>(`/dashboard/charts/${productSlug}`, { signal });
  },
};
