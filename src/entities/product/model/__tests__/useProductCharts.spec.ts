import { focusManager, QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { flushPromises } from '@vue/test-utils';
import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { App, Plugin } from 'vue';

import { withSetup } from '@/shared/lib/test';

import { productApi } from '../../api/product-api';
import type { Product, ProductChartResponse, ProductChartSlug } from '../../api/types';
import { productKeys } from '../queryKeys';
import { useProductCharts } from '../useProductCharts';
import { useProducts } from '../useProducts';

vi.mock('../../api/product-api', () => ({
  productApi: { getProductChart: vi.fn(), getProducts: vi.fn() },
}));

const getProductChart = vi.mocked(productApi.getProductChart);
const getProducts = vi.mocked(productApi.getProducts);
const SLUGS: ProductChartSlug[] = ['game-recommender', 'player-intelligence'];
const POLLING_INTERVAL = 5000;

function products(slugs: ProductChartSlug[]): Product[] {
  return slugs.map((name) => ({
    product_id: `${name}-id`,
    name,
    product_status: 'active',
    next_prediction_date: '2026-10-13',
    services: [],
  }));
}

function chart(slug: ProductChartSlug, keys = ['main']): ProductChartResponse {
  return {
    chart_name: slug,
    period: { start_date: '2026-10-12', end_date: '2026-10-12', granularity: 'day' },
    summary: { total_value: keys.length },
    filters: null,
    series: keys.map((key) => ({ series_key: key, points: [{ date: '2026-10-12', value: 1 }] })),
    has_data: true,
  };
}

function response<T>(data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { headers: new AxiosHeaders() },
  };
}

function httpError(status: number) {
  return new AxiosError('failed', String(status), undefined, undefined, {
    ...response({}),
    status,
  });
}

let app: App | undefined;
let queryClient: QueryClient;

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  });
  getProducts.mockResolvedValue(response(products(SLUGS)));
  getProductChart.mockImplementation(async (slug) => response(chart(slug)));
});

afterEach(() => {
  app?.unmount();
  app = undefined;
  queryClient.clear();
  focusManager.setFocused(undefined);
  vi.useRealTimers();
  vi.resetAllMocks();
});

async function run(slugs = SLUGS, anotherConsumer = false) {
  const vueQuery: Plugin = { install: (target) => target.use(VueQueryPlugin, { queryClient }) };
  const [queries, mounted] = withSetup(() => {
    if (anotherConsumer) useProducts();
    return useProductCharts(slugs);
  }, [vueQuery]);
  app = mounted;
  await flushPromises();
  return queries;
}

describe('useProductCharts', () => {
  it.each(SLUGS)(
    'polls %s without clearing the chart while the response is pending',
    async (slug) => {
      vi.useFakeTimers();
      const queries = await run([slug]);
      let resolveChart!: (value: AxiosResponse<ProductChartResponse>) => void;
      getProductChart.mockReturnValueOnce(new Promise((resolve) => (resolveChart = resolve)));

      await vi.advanceTimersByTimeAsync(POLLING_INTERVAL);

      expect(getProductChart).toHaveBeenCalledTimes(2);
      expect(queries.value[0]).toMatchObject({
        data: chart(slug),
        isLoading: false,
        isError: false,
      });

      const updated = chart(slug, ['main', 'new-scenario']);
      resolveChart(response(updated));
      await flushPromises();

      expect(queries.value[0]?.data).toEqual(updated);
    },
  );

  it('keeps cached metrics after a polling failure and recovers on the next poll', async () => {
    vi.useFakeTimers();
    const queries = await run(['game-recommender']);
    getProductChart.mockRejectedValueOnce(httpError(500));

    await vi.advanceTimersByTimeAsync(POLLING_INTERVAL);

    expect(queries.value[0]).toMatchObject({
      data: chart('game-recommender'),
      isLoading: false,
      isError: true,
    });

    const updated = chart('game-recommender', ['main', 'new-scenario']);
    getProductChart.mockResolvedValueOnce(response(updated));
    await vi.advanceTimersByTimeAsync(POLLING_INTERVAL);

    expect(queries.value[0]).toMatchObject({ data: updated, isLoading: false, isError: false });
  });

  it('pauses chart polling in the background and resumes in the active tab', async () => {
    vi.useFakeTimers();
    await run();
    focusManager.setFocused(false);

    await vi.advanceTimersByTimeAsync(3 * POLLING_INTERVAL);
    expect(getProductChart).toHaveBeenCalledTimes(SLUGS.length);

    focusManager.setFocused(true);
    await vi.advanceTimersByTimeAsync(POLLING_INTERVAL);
    expect(getProductChart).toHaveBeenCalledTimes(2 * SLUGS.length);
  });

  it('stops chart polling after unmount', async () => {
    vi.useFakeTimers();
    await run();
    app?.unmount();
    app = undefined;

    await vi.advanceTimersByTimeAsync(3 * POLLING_INTERVAL);

    expect(getProductChart).toHaveBeenCalledTimes(SLUGS.length);
  });

  it('polls only connected products and stops after disconnection', async () => {
    vi.useFakeTimers();
    getProducts.mockResolvedValue(response(products(['game-recommender'])));
    await run();
    await vi.advanceTimersByTimeAsync(POLLING_INTERVAL);
    expect(getProductChart.mock.calls.map(([slug]) => slug)).toEqual([
      'game-recommender',
      'game-recommender',
    ]);

    getProducts.mockResolvedValue(response([]));
    queryClient.setQueryData(productKeys.list(), []);
    await flushPromises();
    await vi.advanceTimersByTimeAsync(3 * POLLING_INTERVAL);

    expect(getProductChart).toHaveBeenCalledTimes(2);
  });

  it('shares the product-list request and fetches each connected chart with a signal', async () => {
    const queries = await run(SLUGS, true);

    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(queries.value.map((query) => query.data?.chart_name)).toEqual(SLUGS);
    expect(getProductChart.mock.calls.map(([slug]) => slug)).toEqual(SLUGS);
    expect(getProductChart.mock.calls.every(([, signal]) => signal instanceof AbortSignal)).toBe(
      true,
    );
    expect(queryClient.getQueryData(productKeys.chart('player-intelligence'))).toBeDefined();
  });

  it('waits for the product list and never requests a disconnected chart', async () => {
    let resolveProducts!: (value: AxiosResponse<Product[]>) => void;
    getProducts.mockReturnValueOnce(new Promise((resolve) => (resolveProducts = resolve)));
    const queries = await run();

    expect(getProductChart).not.toHaveBeenCalled();
    expect(queries.value.every((query) => query.isLoading && query.data === undefined)).toBe(true);

    resolveProducts(response(products(['game-recommender'])));
    await flushPromises();

    expect(getProductChart.mock.calls.map(([slug]) => slug)).toEqual(['game-recommender']);
    expect(queries.value[1]).toMatchObject({ data: null, isLoading: false, isError: false });
    await queries.value[1]?.refetch();
    expect(getProductChart).toHaveBeenCalledTimes(1);
  });

  it('shows unavailable charts without sending chart requests for an empty product list', async () => {
    getProducts.mockResolvedValue(response([]));
    const queries = await run();

    expect(getProductChart).not.toHaveBeenCalled();
    expect(
      queries.value.every((query) => query.data === null && !query.isLoading && !query.isError),
    ).toBe(true);
  });

  it('refetch retries the product list and shows loading until the response arrives', async () => {
    getProducts.mockRejectedValueOnce(httpError(500));
    const queries = await run();

    expect(
      queries.value.every((query) => query.isError && !query.isLoading && query.data === undefined),
    ).toBe(true);
    expect(getProductChart).not.toHaveBeenCalled();

    let resolveProducts!: (value: AxiosResponse<Product[]>) => void;
    getProducts.mockReturnValueOnce(new Promise((resolve) => (resolveProducts = resolve)));
    const retry = queries.value[0]?.refetch();
    await flushPromises();

    expect(
      queries.value.every((query) => query.isLoading && !query.isError && query.data === undefined),
    ).toBe(true);
    expect(getProductChart).not.toHaveBeenCalled();

    resolveProducts(response(products(SLUGS)));
    await retry;
    await flushPromises();

    expect(getProducts).toHaveBeenCalledTimes(2);
    expect(queries.value.map((query) => query.data?.chart_name)).toEqual(SLUGS);
  });

  it('hides PreVIP variants for the view but preserves the complete response in the cache', async () => {
    const data = chart('player-intelligence', [
      'previp-detection_micoformer',
      'previp-detection_3',
      'previp-detection_5',
      'previp-detection_7',
      'vip-churn',
    ]);
    getProductChart.mockResolvedValue(response(data));
    const queries = await run(['player-intelligence']);

    expect(queries.value[0]?.data).toEqual({
      ...data,
      series: [data.series[0], data.series[4]],
      summary: { total_value: 2 },
    });
    expect(queryClient.getQueryData(productKeys.chart('player-intelligence'))).toEqual(data);
    expect(data.series).toHaveLength(5);
  });

  it('shows an empty chart if only hidden series have data', async () => {
    getProductChart.mockResolvedValue(
      response(chart('player-intelligence', ['previp-detection_3', 'previp-detection_5'])),
    );
    const queries = await run(['player-intelligence']);

    expect(queries.value[0]?.data).toMatchObject({
      series: [],
      summary: { total_value: 0 },
      has_data: false,
    });
  });

  it('treats a chart 404 after the connection lookup as unavailable', async () => {
    getProductChart.mockRejectedValue(httpError(404));
    const queries = await run(['game-recommender']);

    expect(queries.value[0]).toMatchObject({ data: null, isLoading: false, isError: false });
  });

  it('retries only the failed chart after a successful connection lookup', async () => {
    getProductChart.mockRejectedValueOnce(httpError(500));
    const queries = await run(['game-recommender']);

    expect(queries.value[0]).toMatchObject({ data: undefined, isError: true, isLoading: false });
    await queries.value[0]?.refetch();

    expect(queries.value[0]?.data).toEqual(chart('game-recommender'));
    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(getProductChart).toHaveBeenCalledTimes(2);
  });

  it('keeps cached chart data if a subsequent chart request fails', async () => {
    const queries = await run(['game-recommender']);
    getProductChart.mockRejectedValueOnce(httpError(500));
    await queries.value[0]?.refetch();

    expect(queries.value[0]?.data).toEqual(chart('game-recommender'));
    expect(queries.value[0]?.isError).toBe(true);
  });

  it('hides disconnected cached charts and starts newly connected ones', async () => {
    getProducts.mockResolvedValue(response(products(['game-recommender'])));
    const queries = await run();

    queryClient.setQueryData(productKeys.list(), products(['player-intelligence']));
    await flushPromises();

    expect(queries.value[0]?.data).toBeNull();
    expect(queries.value[1]?.data?.chart_name).toBe('player-intelligence');
    expect(getProductChart.mock.calls.map(([slug]) => slug)).toEqual(SLUGS);
    await queries.value[0]?.refetch();
    expect(getProductChart).toHaveBeenCalledTimes(2);
  });

  it('does not refetch charts when the product list refreshes with the same connections', async () => {
    await run();
    queryClient.setQueryData(productKeys.list(), products(SLUGS));
    await flushPromises();

    expect(getProductChart).toHaveBeenCalledTimes(2);
  });
});
