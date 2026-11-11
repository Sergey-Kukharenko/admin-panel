import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { type App, ref } from 'vue';

import { withSetup } from '@/shared/lib/test';

import type { DataVolumeChartFilters, DataVolumeChartResponse } from '../../api/types';
import { useDataVolumeChart } from '../useDataVolumeChart';

const getChart = vi.hoisted(() => vi.fn());
vi.mock('../../api/dataset-api', () => ({
  datasetApi: { getDataVolumeChart: getChart },
}));

const response: DataVolumeChartResponse = {
  chart_name: 'data-volume',
  period: { start_date: '2026-10-12', end_date: '2026-10-13', granularity: 'day' },
  summary: { total_value: 0 },
  filters: { dataset_types: [] },
  series: [],
  has_data: false,
};

let app: App | undefined;
let client: QueryClient | undefined;

function setup(filters = ref<DataVolumeChartFilters>({})) {
  client ??= new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const queryClient = client;
  const [query, mounted] = withSetup(
    () => useDataVolumeChart(filters),
    [{ install: (vueApp) => vueApp.use(VueQueryPlugin, { queryClient }) }],
  );
  app = mounted;
  return query;
}

afterEach(() => {
  app?.unmount();
  app = undefined;
  client?.clear();
  client = undefined;
  getChart.mockReset();
});

describe('useDataVolumeChart', () => {
  it('keeps cached data when a refetch of the same key fails', async () => {
    getChart.mockResolvedValueOnce({ data: response });
    const query = setup();
    await vi.waitFor(() => expect(query.isSuccess.value).toBe(true));

    getChart.mockRejectedValueOnce(new Error('Refetch failed'));
    await query.refetch();

    expect(query.isError.value).toBe(true);
    expect(query.data.value).toEqual(response);
  });

  it('clears the previous placeholder when a request for a new key fails', async () => {
    getChart.mockResolvedValueOnce({ data: response });
    const filters = ref<DataVolumeChartFilters>({});
    const query = setup(filters);
    await vi.waitFor(() => expect(query.isSuccess.value).toBe(true));

    let rejectRequest!: (error: Error) => void;
    getChart.mockImplementationOnce(
      () => new Promise((_resolve, reject) => (rejectRequest = reject)),
    );
    filters.value = { dataset_type_id__in: '3f1c2c6e-8a5d-4b7b-9a1e-2f0d6c1e9b11' };
    await vi.waitFor(() => expect(query.isPlaceholderData.value).toBe(true));
    expect(query.data.value).toEqual(response);

    rejectRequest(new Error('New filter failed'));
    await vi.waitFor(() => expect(query.isError.value).toBe(true));

    expect(query.data.value).toBeUndefined();
    expect(query.isPlaceholderData.value).toBe(false);
  });

  it('refetches cached data when the chart is mounted again', async () => {
    getChart.mockResolvedValue({ data: response });
    const firstQuery = setup();
    await vi.waitFor(() => expect(firstQuery.isSuccess.value).toBe(true));
    app?.unmount();

    const nextQuery = setup();
    await vi.waitFor(() => expect(getChart).toHaveBeenCalledTimes(2));
    await vi.waitFor(() => expect(nextQuery.isFetching.value).toBe(false));

    expect(nextQuery.data.value).toEqual(response);
  });
});
