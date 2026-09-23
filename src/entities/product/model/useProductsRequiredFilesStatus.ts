import { useQueries } from '@tanstack/vue-query';
import { computed, type Ref } from 'vue';

import { productApi } from '../api/product-api';
import type { ProductRequiredFilesStatus } from './api';
import { PREDICTIONS_POLLING_INTERVAL } from './useProducts';

export const PRODUCT_REQUIRED_FILES_STATUS_QUERY_KEY = 'product-required-files-status';

/**
 * Статус Core Data Validator по каждому продукту (GET /products/{id}/required-files/status).
 * Эндпоинт — на один продукт, поэтому запросы идут параллельно через useQueries и опрашиваются
 * тем же интервалом, что и /products, чтобы карточки вышли из AWAITING сразу после валидации.
 *
 * Возвращает map product_id -> статус; продукта нет в map, пока его запрос не загрузился
 * (или упал) — вызывающая сторона трактует это как «флаг неизвестен», а не как «не готов».
 */
export function useProductsRequiredFilesStatus(productIds: Ref<string[]>) {
  const queries = useQueries({
    queries: computed(() =>
      productIds.value.map((productId) => ({
        queryKey: [PRODUCT_REQUIRED_FILES_STATUS_QUERY_KEY, productId],
        queryFn: async () => {
          const response = await productApi.getRequiredFilesStatus(productId);
          return response.data;
        },
        refetchInterval: PREDICTIONS_POLLING_INTERVAL,
      })),
    ),
  });

  const statusByProductId = computed(() => {
    const result = new Map<string, ProductRequiredFilesStatus>();

    for (const query of queries.value) {
      if (query.data) result.set(query.data.product_id, query.data);
    }

    return result;
  });

  return { statusByProductId };
}
