import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { computed, watch } from 'vue';

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

const RUN_HISTORY_QUERY_KEY = 'prediction-run-history';

export function useRunHistoryTable() {
  const filters = useRunHistoryFilters();
  const { selectedProductId, page, perPage, orderBy } = filters;

  const {
    data: runsResponse,
    isLoading,
    isError: isRequestError,
    refetch,
  } = useQuery({
    queryKey: computed(() => [
      RUN_HISTORY_QUERY_KEY,
      selectedProductId.value,
      orderBy.value,
      page.value,
      perPage.value,
    ]),
    queryFn: async ({ signal }) => {
      const response = await mlServiceRunApi.getMLServiceRuns(
        {
          product_id__in: selectedProductId.value || undefined,
          order_by: orderBy.value,
          limit: perPage.value,
          offset: (page.value - 1) * perPage.value,
        },
        signal,
      );
      return response.data;
    },
    // При смене фильтра, сортировки или страницы оставляем прошлую таблицу до ответа —
    // без мигания скелетоном
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

  const totalCount = computed(() => runsResponse.value?.total_count ?? 0);

  // Пустой ответ при выбранном продукте или на дальней странице — это «нет прогонов здесь»,
  // а не «истории нет совсем», поэтому фильтр и пагинацию не прячем
  const hasData = computed(
    () => records.value.length > 0 || Boolean(selectedProductId.value) || page.value > 1,
  );

  // Страница из URL может оказаться за пределами истории (старая ссылка, история
  // сократилась) — переводим на последнюю существующую
  watch(totalCount, (total) => {
    const lastPage = Math.max(1, Math.ceil(total / perPage.value));
    if (runsResponse.value && page.value > lastPage) page.value = lastPage;
  });

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
    totalCount,
    hasData,
    isLoading,
    isError,
    refetch,
    ...filters,
    downloadRecord,
  };
}
