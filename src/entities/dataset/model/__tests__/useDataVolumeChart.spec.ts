import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import type { DataVolumeChartFilters } from '../../api/types';
import { useDataVolumeChart } from '../useDataVolumeChart';

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

describe('useDataVolumeChart (mock until WT-322)', () => {
  it('returns every data type of the period without a filter (RFC 4.2)', () => {
    const { data } = useDataVolumeChart({});

    expect(data.value?.series.map((series) => series.series_key)).toEqual([
      'bets',
      'users',
      'bets-daily',
      'balance-daily',
      'payments',
      'vip-users',
    ]);
    expect(data.value?.series.every((series) => series.points.length === 31)).toBe(true);
    expect(data.value?.summary.total_value).toBe(
      sum(data.value?.series.flatMap((series) => series.points.map((point) => point.value)) ?? []),
    );
  });

  it('keeps only the selected types and recalculates the summary, as the backend does', () => {
    const filters = ref<DataVolumeChartFilters>({});
    const { data } = useDataVolumeChart(filters);
    const betsId = data.value?.filters?.dataset_types.find(
      (type) => type.name === 'bets',
    )?.dataset_type_id;

    filters.value = { dataset_type_id__in: [betsId ?? ''] };

    expect(data.value?.series.map((series) => series.series_key)).toEqual(['bets']);
    expect(data.value?.summary.total_value).toBe(
      sum(data.value?.series[0]?.points.map((point) => point.value) ?? []),
    );
    // the filter list stays complete so the user can switch to another type
    expect(data.value?.filters?.dataset_types).toHaveLength(6);
  });

  it('has the shape of useQuery: a synchronous mock is never loading or failing', () => {
    const { isLoading, isError, refetch } = useDataVolumeChart({});

    expect([isLoading.value, isError.value]).toEqual([false, false]);
    expect(refetch()).toBeInstanceOf(Promise);
  });
});
