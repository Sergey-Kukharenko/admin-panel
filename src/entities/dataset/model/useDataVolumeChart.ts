import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import { datasetApi } from '../api/dataset-api';
import type { DataVolumeChartFilters } from '../api/types';
import { datasetKeys } from './queryKeys';

/** Rows of succeeded uploads per day and data type for the last 30 days (dashboard chart) */
export function useDataVolumeChart(filters: MaybeRefOrGetter<DataVolumeChartFilters>) {
  return useQuery({
    queryKey: computed(() => datasetKeys.dataVolumeChart(toValue(filters))),
    queryFn: async ({ signal }) => {
      return (await datasetApi.getDataVolumeChart(toValue(filters), signal)).data;
    },
    // Switching the data type keeps the current chart on screen instead of the skeleton
    placeholderData: keepPreviousData,
  });
}
