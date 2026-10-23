import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import type { ProductChartResponse } from '../api/types';
import { MOCK_PRODUCT_CHARTS } from '../config/mocks';

/**
 * Daily results of the product's ML services for the last 30 days (dashboard product chart).
 * Returns the shape of `useQuery` already (`data`, `isLoading`, `isError`, `refetch`), so switching
 * to the API changes only this file. `data`: `undefined` — not loaded yet, `null` — the product is
 * not connected to the project (the API answers 404). Any slug is accepted: the list of products
 * comes from the backend, an unknown one is just «not connected».
 * TODO: WT-322 — replace the mock with a query to GET /dashboard/charts/{productSlug} (a query key
 * per product), mapping a 404 to `null`. The dashboard calls it once per product of a fixed list;
 * with the API switch to `useQueries` over the product list (one query per product: parallel queries
 * of one kind go through `useQueries`, CLAUDE.md «Серверное состояние»), MR !85.
 */
export function useProductChart(productSlug: MaybeRefOrGetter<string>) {
  const data = computed<ProductChartResponse | null | undefined>(
    () => MOCK_PRODUCT_CHARTS[toValue(productSlug)] ?? null,
  );

  // the mock is synchronous: never loading, never failing
  const isLoading = computed(() => false);
  const isError = computed(() => false);
  const refetch = async () => {};

  return { data, isLoading, isError, refetch };
}
