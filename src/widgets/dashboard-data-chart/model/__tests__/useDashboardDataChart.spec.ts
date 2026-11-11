import { flushPromises } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { type App, computed, ref, toValue } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';

import type { DataVolumeChartFilters, DataVolumeChartResponse } from '@/entities/dataset';
import { i18n } from '@/shared/i18n';
import { withSetup } from '@/shared/lib/test';

import { useDashboardDataChart } from '../useDashboardDataChart';

const BETS_ID = '3f1c2c6e-8a5d-4b7b-9a1e-2f0d6c1e9b11';
const USERS_ID = '7a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d';

const response = ref<DataVolumeChartResponse | undefined>();
const isRequestError = ref(false);
let requestFilters: () => DataVolumeChartFilters = () => ({});

// The entity query is replaced: the test drives the response and reads the filters it was given
vi.mock('@/entities/dataset', () => ({
  useDataVolumeChart: (filters: () => DataVolumeChartFilters) => {
    requestFilters = () => toValue(filters);
    return {
      data: computed(() => response.value),
      isLoading: computed(() => response.value === undefined && !isRequestError.value),
      isError: computed(() => isRequestError.value),
      refetch: vi.fn(),
    };
  },
}));

function chartResponse(): DataVolumeChartResponse {
  return {
    chart_name: 'data-volume',
    period: { start_date: '2026-10-12', end_date: '2026-10-13', granularity: 'day' },
    summary: { total_value: 30 },
    filters: {
      dataset_types: [
        { dataset_type_id: BETS_ID, name: 'bets' },
        { dataset_type_id: USERS_ID, name: 'users' },
      ],
    },
    series: [
      {
        series_key: 'bets',
        dataset_type_id: BETS_ID,
        points: [
          { date: '2026-10-12', value: 10 },
          { date: '2026-10-13', value: 20 },
        ],
      },
    ],
    has_data: true,
  };
}

let app: App | undefined;

async function setup(url: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/dashboard', component: { render: () => null } }],
  });
  await router.push(url);
  await router.isReady();

  const [result, mounted] = withSetup(() => useDashboardDataChart(), [router, i18n]);
  app = mounted;
  return { ...result, router };
}

afterEach(() => {
  app?.unmount();
  app = undefined;
  response.value = undefined;
  isRequestError.value = false;
});

describe('useDashboardDataChart', () => {
  it('sends the data type from the URL to the API', async () => {
    await setup(`/dashboard?dataTypeId=${BETS_ID}`);

    expect(requestFilters()).toEqual({ dataset_type_id__in: BETS_ID });
  });

  it.each([USERS_ID.toUpperCase(), ` ${USERS_ID.toUpperCase()} `])(
    'keeps the selected type for a non-canonical UUID: %s',
    async (rawId) => {
      const ctx = await setup(`/dashboard?dataTypeId=${encodeURIComponent(rawId)}`);

      expect(requestFilters()).toEqual({ dataset_type_id__in: USERS_ID });
      response.value = chartResponse();
      await flushPromises();

      expect(ctx.selectedTypeId.value).toBe(USERS_ID);
      expect(ctx.router.currentRoute.value.query.dataTypeId).toBe(rawId);
      expect(requestFilters()).toEqual({ dataset_type_id__in: USERS_ID });
    },
  );

  it('requests all types for a non-UUID id and drops it once the type list arrives', async () => {
    const ctx = await setup('/dashboard?dataTypeId=garbage');

    expect(requestFilters()).toEqual({});
    // still loading: the list is unknown, the id stays
    expect(ctx.router.currentRoute.value.query.dataTypeId).toBe('garbage');

    response.value = chartResponse();
    await flushPromises();

    expect(ctx.router.currentRoute.value.query.dataTypeId).toBeUndefined();
    expect(ctx.selectedTypeId.value).toBe('');
  });

  it('drops a UUID that is not in the type list of the period', async () => {
    const ctx = await setup('/dashboard?dataTypeId=00000000-0000-4000-8000-000000000000');
    response.value = chartResponse();
    await flushPromises();

    expect(ctx.router.currentRoute.value.query.dataTypeId).toBeUndefined();
  });

  it('keeps a known type: selected in the filter and in the URL', async () => {
    const ctx = await setup(`/dashboard?dataTypeId=${USERS_ID}`);
    response.value = chartResponse();
    await flushPromises();

    expect(ctx.selectedTypeId.value).toBe(USERS_ID);
    expect(ctx.router.currentRoute.value.query.dataTypeId).toBe(USERS_ID);
  });

  it('writes the chosen type to the URL and removes it for «all types»', async () => {
    const ctx = await setup('/dashboard');
    response.value = chartResponse();
    await flushPromises();

    ctx.selectedTypeId.value = BETS_ID;
    await flushPromises();
    expect(ctx.router.currentRoute.value.query.dataTypeId).toBe(BETS_ID);
    expect(requestFilters()).toEqual({ dataset_type_id__in: BETS_ID });

    ctx.selectedTypeId.value = '';
    await flushPromises();
    expect(ctx.router.currentRoute.value.query.dataTypeId).toBeUndefined();
    expect(requestFilters()).toEqual({});
  });

  it('builds the filter options from the API list after «all types»', async () => {
    const ctx = await setup('/dashboard');
    response.value = chartResponse();
    await flushPromises();

    expect(ctx.typeOptions.value).toEqual([
      { value: '', label: i18n.global.t('dashboard.dataChart.allTypes') },
      { value: BETS_ID, label: 'bets' },
      { value: USERS_ID, label: 'users' },
    ]);
  });

  it('shows the error state only when there is no data at all', async () => {
    const ctx = await setup('/dashboard');

    isRequestError.value = true;
    expect(ctx.isError.value).toBe(true);
    expect(ctx.chart.value).toBeNull();

    // a failed refetch keeps the chart on screen
    response.value = chartResponse();
    expect(ctx.isError.value).toBe(false);
    expect(ctx.chart.value?.totalRows).toBe(30);
  });
});
