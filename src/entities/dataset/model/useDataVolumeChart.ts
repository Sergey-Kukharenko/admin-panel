import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import { datasetApi } from '../api/dataset-api';
import type { DataVolumeChartFilters } from '../api/types';
import { datasetKeys } from './queryKeys';

// PM decision, 2026-11-10 (WT-332): refresh after processing without leaving the dashboard.
// No push channel: five seconds bounds the visible refresh delay after validation to one interval,
// matching the status refresh cadence. This is a UI choice, not a measured backend load budget.
// The chart has no pending-upload flag; revisit the interval with the backend if load is an issue.
const DATA_VOLUME_POLLING_INTERVAL = 5000;

/** Rows of succeeded uploads per day and data type for the last 30 days (dashboard chart) */
export function useDataVolumeChart(filters: MaybeRefOrGetter<DataVolumeChartFilters>) {
  return useQuery({
    queryKey: computed(() => datasetKeys.dataVolumeChart(toValue(filters))),
    queryFn: async ({ signal }) => {
      return (await datasetApi.getDataVolumeChart(toValue(filters), signal)).data;
    },
    // Switching the data type keeps the current chart on screen instead of the skeleton
    placeholderData: keepPreviousData,
    refetchInterval: DATA_VOLUME_POLLING_INTERVAL,
    // Background polling is disabled by default, as in useProducts.
  });
}
