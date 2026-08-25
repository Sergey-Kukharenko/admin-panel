import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { datasetApi } from '../api/dataset-api';

const PROCESSING_FILES_QUERY_KEY = ['dataset-processing-files'];
const PROCESSING_FILES_POLL_INTERVAL_MS = 30000;

/**
 * Лёгкий опрос: есть ли хотя бы один файл в статусе "awaiting"/"processing" — используется
 * за пределами страницы датасетов (например, в боковом меню), поэтому запрашивает только
 * количество совпадений, а не полную историю загрузок.
 */
export function useHasProcessingFiles() {
  const { data } = useQuery({
    queryKey: PROCESSING_FILES_QUERY_KEY,
    queryFn: async () => {
      const response = await datasetApi.getFiles({
        limit: 1,
        status__in: 'awaiting,processing',
      });

      return response.data.total_count > 0;
    },
    refetchInterval: PROCESSING_FILES_POLL_INTERVAL_MS,
  });

  return {
    hasProcessingFiles: computed(() => data.value ?? false),
  };
}
