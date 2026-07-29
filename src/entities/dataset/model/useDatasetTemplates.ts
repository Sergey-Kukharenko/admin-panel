import { useQuery } from '@tanstack/vue-query';

import { datasetApi } from '../api/dataset-api';

const TEMPLATES_QUERY_KEY = ['dataset-templates'];
const TEMPLATES_STALE_TIME = 1000 * 60 * 15;

/**
 * Список шаблонов датасетов кэшируется TanStack Query по общему ключу,
 * поэтому композабл безопасно использовать из нескольких мест одновременно.
 */
export function useDatasetTemplates() {
  return useQuery({
    queryKey: TEMPLATES_QUERY_KEY,
    queryFn: async () => {
      const response = await datasetApi.getTemplates();
      return response.data;
    },
    staleTime: TEMPLATES_STALE_TIME,
  });
}
