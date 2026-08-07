import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { predictionApi } from '@/entities/prediction';
import { downloadBlob } from '@/shared/lib/downloadBlob';

import { mapPredictionResultToRunRecord } from './mapper';
import type { PredictionRunRecord } from './types';
import { useRunHistoryFilters } from './useRunHistoryFilters';

// Максимум, разрешенный бэкендом за один запрос (см. GET /predictions: limit <= 100)
const PREDICTIONS_PAGE_LIMIT = 100;
const PREDICTIONS_QUERY_KEY = ['prediction-run-history'];

export function useRunHistoryTable() {
  const { selectedProductId, selectedProductName, productOptions } = useRunHistoryFilters();

  const {
    data: predictionsResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: PREDICTIONS_QUERY_KEY,
    queryFn: async ({ signal }) => {
      const response = await predictionApi.getPredictions(
        { limit: PREDICTIONS_PAGE_LIMIT, offset: 0 },
        signal,
      );
      return response.data;
    },
  });

  const allRecords = computed<PredictionRunRecord[]>(() =>
    (predictionsResponse.value?.items ?? []).map(mapPredictionResultToRunRecord),
  );

  // GET /predictions пока поддерживает только limit/offset (без фильтра по продукту),
  // поэтому фильтруем уже загруженный список на клиенте. Как только бэкенд добавит
  // параметр вроде product_id, достаточно передать selectedProductId в getPredictions
  // и убрать этот filter — remainder кода не изменится
  const records = computed(() => {
    if (!selectedProductId.value) return allRecords.value;
    return allRecords.value.filter((record) => record.productId === selectedProductId.value);
  });

  const hasData = computed(() => allRecords.value.length > 0);

  async function downloadRecord(record: PredictionRunRecord) {
    try {
      const response = await predictionApi.downloadPrediction(record.id);
      downloadBlob(response.data, `prediction_${record.id}.csv`);
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
