import { computed } from 'vue';

import type { RecentOperationListResponse } from '../api/types';
import { MOCK_RECENT_OPERATIONS } from '../config/mocks';

/**
 * The latest operations of the project (dashboard «Последние операции»). Returns the shape of
 * `useQuery` already (`data`, `isLoading`, `isError`, `refetch`), so switching to the API changes
 * only this file. `data`: `undefined` — not loaded yet.
 * TODO: WT-334 — a query to the operations endpoint once it exists (with a query key factory and,
 * per WT-334, paging and status polling); until then the mock.
 */
export function useRecentOperations() {
  const data = computed<RecentOperationListResponse | undefined>(() => MOCK_RECENT_OPERATIONS);

  // the mock is synchronous: never loading, never failing
  const isLoading = computed(() => false);
  const isError = computed(() => false);
  const refetch = async () => {};

  return { data, isLoading, isError, refetch };
}
