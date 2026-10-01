import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { computed, watch } from 'vue';

import { predictionApi } from '@/entities/prediction';
import {
  mlServiceRunApi,
  PREDICTIONS_POLLING_INTERVAL,
  useProductDisplayNames,
  useProducts,
} from '@/entities/product';
import { downloadBlob } from '@/shared/lib/downloadBlob';

import { mapServiceRunToRunRecord } from './mapper';
import type { PredictionRunRecord } from './types';
import { RUN_HISTORY_PAGE_SIZE, useRunHistoryFilters } from './useRunHistoryFilters';

const RUN_HISTORY_QUERY_KEY = 'prediction-run-history';

export function useRunHistoryTable() {
  const filters = useRunHistoryFilters();
  const { selectedProductId, page, orderBy } = filters;

  // Скрытые сервисы (entities/product/hiddenServices) убираем на сервере, передавая список
  // видимых ml_service_id: фильтр на клиенте сломал бы пагинацию и счетчик «1-20 из N».
  // /products уже без скрытых сервисов (select в useProducts), поэтому ждем его загрузки —
  // иначе на первом кадре мелькнули бы скрытые прогоны
  const { data: products, isError: isProductsError } = useProducts();
  const visibleServiceIds = computed(() =>
    (products.value ?? [])
      .filter(
        (product) => !selectedProductId.value || product.product_id === selectedProductId.value,
      )
      .flatMap((product) => product.services.map((service) => service.ml_service_id))
      .join(','),
  );

  const {
    data: runsResponse,
    isLoading,
    isError: isRequestError,
    refetch,
  } = useQuery({
    queryKey: computed(() => [
      RUN_HISTORY_QUERY_KEY,
      selectedProductId.value,
      visibleServiceIds.value,
      orderBy.value,
      page.value,
    ]),
    queryFn: async ({ signal }) => {
      const response = await mlServiceRunApi.getMLServiceRuns(
        {
          product_id__in: selectedProductId.value || undefined,
          ml_service_id__in: visibleServiceIds.value || undefined,
          order_by: orderBy.value,
          limit: RUN_HISTORY_PAGE_SIZE,
          offset: (page.value - 1) * RUN_HISTORY_PAGE_SIZE,
        },
        signal,
      );
      return response.data;
    },
    // Если /products не загрузился, историю все равно показываем (без фильтра по сервисам)
    enabled: computed(() => products.value !== undefined || isProductsError.value),
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
    const lastPage = Math.max(1, Math.ceil(total / RUN_HISTORY_PAGE_SIZE));
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
