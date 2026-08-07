import { apiClient } from '@/shared/api';

import type { Product, ProductRequiredFilesStatus } from '../model/api';

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
};
