import { useQuery } from '@tanstack/vue-query';

import { productApi } from '../api/product-api';

export const PRODUCTS_QUERY_KEY = ['products'];
// Push-канала (WS/SSE) у бэкенда нет, поэтому статусы сервисов обновляем поллингом —
// по PRD смена статуса должна появиться в интерфейсе максимум за 5 секунд (AC 6).
// Вкладка в фоне не опрашивается (refetchIntervalInBackground по умолчанию false)
export const PREDICTIONS_POLLING_INTERVAL = 5000;

/**
 * Список продуктов проекта кэшируется TanStack Query по общему ключу, поэтому
 * composable безопасно использовать одновременно в нескольких виджетах
 * (predictions-manager, prediction-processing-schedule, фильтр в prediction-run-history) —
 * запрос на /products выполнится один раз и переиспользуется из кэша, а поллинг
 * идет одним таймером на все подписанные виджеты.
 */
export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: async () => {
      const response = await productApi.getProducts();
      return response.data;
    },
    refetchInterval: PREDICTIONS_POLLING_INTERVAL,
  });
}
