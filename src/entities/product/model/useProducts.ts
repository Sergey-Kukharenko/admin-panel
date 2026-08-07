import { useQuery } from '@tanstack/vue-query';

import { productApi } from '../api/product-api';

export const PRODUCTS_QUERY_KEY = ['products'];
const PRODUCTS_STALE_TIME = 1000 * 60;

/**
 * Список продуктов проекта кэшируется TanStack Query по общему ключу, поэтому
 * composable безопасно использовать одновременно в нескольких виджетах
 * (predictions-manager, prediction-processing-schedule, фильтр в prediction-run-history) —
 * запрос на /products выполнится один раз и переиспользуется из кэша.
 */
export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: async () => {
      const response = await productApi.getProducts();
      return response.data;
    },
    staleTime: PRODUCTS_STALE_TIME,
  });
}
