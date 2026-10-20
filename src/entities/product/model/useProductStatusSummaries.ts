import { computed } from 'vue';

import { MOCK_PRODUCT_STATUS_SUMMARIES } from '../config/mocks';

/**
 * Product / Data / Result statuses of the client's products.
 * TODO: WT-322 — replace the mocks with a query to the API: the composable will also return
 * isLoading / isError / refetch, and the dashboard-products widget gets its skeleton and error
 * states. A new client without any data gets the cards in the awaiting state, there is no empty
 * state (PM decision, 2026-10-16).
 */
export function useProductStatusSummaries() {
  const summaries = computed(() => MOCK_PRODUCT_STATUS_SUMMARIES);

  return { summaries };
}
