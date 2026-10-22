import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import type { DataVolumeChartFilters, DataVolumeChartResponse } from '../api/types';
import { MOCK_DATA_VOLUME_CHART } from '../config/mocks';

/**
 * Processed rows per day and data type for the last 30 days (dashboard chart).
 * Returns the shape of `useQuery` already (`data` can be undefined, `isLoading`, `isError`,
 * `refetch`), so switching to the API changes only this file.
 * TODO: WT-322 — replace the mock with a query to GET /dashboard/charts/data-volume; until then the
 * filter is applied here the way the backend applies it (RFC Ph-1 Dashboard, 4.2): only the selected
 * types, the summary recalculated.
 */
export function useDataVolumeChart(filters: MaybeRefOrGetter<DataVolumeChartFilters>) {
  const data = computed<DataVolumeChartResponse | undefined>(() => {
    const ids = toValue(filters).dataset_type_id__in ?? [];
    if (ids.length === 0) return MOCK_DATA_VOLUME_CHART;

    const types = MOCK_DATA_VOLUME_CHART.filters?.dataset_types ?? [];
    const names = new Set(
      types.filter((type) => ids.includes(type.dataset_type_id)).map((type) => type.name),
    );
    const series = MOCK_DATA_VOLUME_CHART.series.filter((item) => names.has(item.series_key));
    const total = series.reduce(
      (sum, item) => sum + item.points.reduce((acc, point) => acc + point.value, 0),
      0,
    );

    return {
      ...MOCK_DATA_VOLUME_CHART,
      summary: { total_value: total },
      series,
      has_data: total > 0,
    };
  });

  // the mock is synchronous: never loading, never failing
  const isLoading = computed(() => false);
  const isError = computed(() => false);
  const refetch = async () => {};

  return { data, isLoading, isError, refetch };
}
