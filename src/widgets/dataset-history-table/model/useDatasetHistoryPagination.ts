import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { QUERY_KEYS } from './queryKeys';
import { createQueryPatch } from './queryPatch';

export const PAGE_SIZE_OPTIONS = [2, 10, 20, 50, 100];
export const DEFAULT_PAGE_SIZE = 10;

export function useDatasetHistoryPagination() {
  const route = useRoute();
  const router = useRouter();
  const replaceQuery = createQueryPatch(route, router);

  const page = computed<number>({
    get() {
      const value = Number(route.query[QUERY_KEYS.page]);
      return Number.isInteger(value) && value > 0 ? value : 1;
    },

    set(value) {
      replaceQuery({
        [QUERY_KEYS.page]: value > 1 ? String(value) : undefined,
      });
    },
  });

  const perPage = computed<number>({
    get() {
      const value = Number(route.query[QUERY_KEYS.perPage]);
      return PAGE_SIZE_OPTIONS.includes(value) ? value : DEFAULT_PAGE_SIZE;
    },

    set(value) {
      // Смена размера страницы возвращает список к первой странице
      replaceQuery({
        [QUERY_KEYS.perPage]: value !== DEFAULT_PAGE_SIZE ? String(value) : undefined,
        [QUERY_KEYS.page]: undefined,
      });
    },
  });

  return { page, perPage };
}
