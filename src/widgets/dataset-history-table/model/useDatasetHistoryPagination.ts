import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { createQueryPatch } from '@/shared/lib/router/createQueryPatch';

import { URL_PARAMS } from './urlParams';

// Размер страницы фиксированный: выбора «Строк на стр.» в UI-ките нет (решение PM)
export const DATASET_HISTORY_PAGE_SIZE = 10;

export function useDatasetHistoryPagination() {
  const route = useRoute();
  const router = useRouter();
  const replaceQuery = createQueryPatch(route, router);

  const page = computed<number>({
    get() {
      const value = Number(route.query[URL_PARAMS.page]);
      return Number.isInteger(value) && value > 0 ? value : 1;
    },

    set(value) {
      replaceQuery({
        [URL_PARAMS.page]: value > 1 ? String(value) : undefined,
      });
    },
  });

  return { page };
}
