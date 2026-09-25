import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { predictionApi } from '@/entities/prediction';
import {
  mlServiceRunApi,
  PREDICTIONS_POLLING_INTERVAL,
  useProductDisplayNames,
} from '@/entities/product';
import { downloadBlob } from '@/shared/lib/downloadBlob';

import { mapServiceRunToRunRecord } from './mapper';
import type { PredictionRunRecord } from './types';
import { useRunHistoryFilters } from './useRunHistoryFilters';

// Максимум, разрешенный бэкендом за один запрос (GET /ml-service-runs: limit <= 100).
// Пагинации в макете истории нет — показываем последние 100 прогонов (по умолчанию бэк
// сортирует по -created_at), сортировка по колонкам — внутри загруженного списка
const RUN_HISTORY_PAGE_LIMIT = 100;
const RUN_HISTORY_QUERY_KEY = 'prediction-run-history';

export function useRunHistoryTable() {
  const { selectedProductId, selectedProductName, productOptions } = useRunHistoryFilters();

  const {
    data: runsResponse,
    isLoading,
    isError: isRequestError,
    refetch,
  } = useQuery({
    queryKey: computed(() => [RUN_HISTORY_QUERY_KEY, selectedProductId.value]),
    queryFn: async ({ signal }) => {
      const response = await mlServiceRunApi.getMLServiceRuns(
        {
          product_id__in: selectedProductId.value || undefined,
          limit: RUN_HISTORY_PAGE_LIMIT,
          offset: 0,
        },
        signal,
      );
      return response.data;
    },
    // При смене фильтра оставляем прошлую таблицу до ответа — без мигания скелетоном
    placeholderData: keepPreviousData,
    // Статусы прогонов (Generating -> Ready/Failed) обновляются тем же поллингом, что и карточки
    refetchInterval: PREDICTIONS_POLLING_INTERVAL,
  });

  // Ошибка фонового поллинга не скрывает уже загруженную таблицу — error-state только без данных
  const isError = computed(() => isRequestError.value && !runsResponse.value);

  const nameResolvers = useProductDisplayNames();

  // Названия зависят от языка интерфейса (t внутри резолверов) — computed пересчитается при смене
  const records = computed<PredictionRunRecord[]>(() =>
    (runsResponse.value?.items ?? []).map((item) => mapServiceRunToRunRecord(item, nameResolvers)),
  );

  // Фильтр по продукту теперь серверный: пустой ответ при выбранном продукте — это «нет
  // прогонов у продукта», а не «истории нет совсем», поэтому фильтр не прячем
  const hasData = computed(() => records.value.length > 0 || Boolean(selectedProductId.value));

  async function downloadRecord(record: PredictionRunRecord) {
    if (!record.predictionResultId) return;

    try {
      const response = await predictionApi.downloadPrediction(record.predictionResultId);
      downloadBlob(response.data, `prediction_${record.predictionResultId}.csv`);
    } catch (e) {
      console.error('Не удалось скачать результат прогноза:', e);
    }
  }

  return {
    records,
    hasData,
    isLoading,
    isError,
    refetch,
    selectedProductId,
    selectedProductName,
    productOptions,
    downloadRecord,
  };
}
