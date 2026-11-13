import { useQueries } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getHttpStatus } from '@/shared/api';

import { productApi } from '../api/product-api';
import type { ProductChartSlug } from '../api/types';
import { withoutHiddenChartSeries } from '../lib/hiddenServices';
import { productKeys } from './queryKeys';
import { useProducts } from './useProducts';

// PM decision, 2026-11-12 (WT-333): refresh product metrics while staying on the dashboard.
// No push channel: use the dashboard's five-second UI cadence; backend load has not been measured.
const PRODUCT_CHART_POLLING_INTERVAL = 5000;

/**
 * Dashboard charts of the given products, one query per product (parallel queries of one kind go
 * through `useQueries`). `data` of a result: `undefined` — not loaded yet, `null` — the product is
 * not connected to the project. The shared product list gates requests (RFC Ph-1 Dashboard, §2);
 * its loading/error states also apply to the charts until connections are known. The order of
 * the results is the order of the slugs. The list is fixed for the component lifetime, not reactive.
 */
export function useProductCharts(productSlugs: readonly ProductChartSlug[]) {
  const products = useProducts();
  const connectedSlugs = computed(() =>
    products.data.value === undefined
      ? undefined
      : new Set(products.data.value.map((product) => product.name)),
  );
  const queries = useQueries({
    queries: computed(() =>
      productSlugs.map((productSlug) => ({
        queryKey: productKeys.chart(productSlug),
        enabled: connectedSlugs.value?.has(productSlug) ?? false,
        // Background polling is disabled by default; disconnected products remain disabled.
        refetchInterval: PRODUCT_CHART_POLLING_INTERVAL,
        select: withoutHiddenChartSeries,
        queryFn: async ({ signal }: { signal: AbortSignal }) => {
          try {
            return (await productApi.getProductChart(productSlug, signal)).data;
          } catch (error) {
            // The connection can disappear between the product-list and chart requests.
            if (getHttpStatus(error) === 404) return null;
            throw error;
          }
        },
      })),
    ),
  });

  return computed(() =>
    productSlugs.map((productSlug, index) => {
      const connected = connectedSlugs.value?.has(productSlug);
      const query = queries.value[index];

      return {
        data: connected === undefined ? undefined : connected ? query?.data : null,
        isLoading:
          connected === undefined
            ? products.isPending.value
            : connected && (query?.isPending ?? true),
        isError:
          connected === undefined ? products.isError.value : connected && (query?.isError ?? false),
        refetch: async () => {
          // A failed connection lookup must retry /products, not a disabled chart query.
          if (products.data.value === undefined) {
            await products.refetch();
          } else if (connectedSlugs.value?.has(productSlug)) {
            await queries.value[index]?.refetch();
          }
        },
      };
    }),
  );
}
