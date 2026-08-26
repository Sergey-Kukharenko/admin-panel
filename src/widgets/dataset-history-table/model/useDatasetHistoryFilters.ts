import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { QUERY_KEYS } from './queryKeys';
import { createQueryPatch } from './queryPatch';
import type { DatasetPeriod, DatasetSort, DatasetSortOrder, DatasetStatus } from './types';

export function useDatasetHistoryFilters() {
  const route = useRoute();
  const router = useRouter();
  const replaceQuery = createQueryPatch(route, router);

  function setSort(by: DatasetSort, order: DatasetSortOrder) {
    replaceQuery({
      [QUERY_KEYS.sort]: by ?? undefined,
      [QUERY_KEYS.order]: by ? order : undefined,
    });
  }

  // ⚡ Сбрасываем все фильтры одним вызовом replaceQuery, а не тремя отдельными
  // присваиваниями (types.value = [], status.value = '', ...): каждое присваивание
  // читает route.query и вызывает router.replace() независимо, а Vue Router обновляет
  // route.query только после разрешения навигации — три синхронных вызова подряд читают
  // один и тот же «устаревший» route.query, и побеждает только последний replace,
  // откатывая изменения, сделанные предыдущими двумя.
  function resetFilters() {
    replaceQuery({
      [QUERY_KEYS.types]: undefined,
      [QUERY_KEYS.status]: undefined,
      [QUERY_KEYS.period]: undefined,
    });
  }

  const types = computed<string[]>({
    get() {
      const value = route.query[QUERY_KEYS.types];

      if (!value) {
        return [];
      }

      return value.toString().split(',');
    },

    set(value) {
      replaceQuery({
        [QUERY_KEYS.types]: value.length ? value.join(',') : undefined,
      });
    },
  });

  const status = computed<DatasetStatus | ''>({
    get() {
      return (route.query[QUERY_KEYS.status] as DatasetStatus) ?? '';
    },

    set(value) {
      replaceQuery({
        [QUERY_KEYS.status]: value || undefined,
      });
    },
  });

  const period = computed<DatasetPeriod | ''>({
    get() {
      return (route.query[QUERY_KEYS.period] as DatasetPeriod) ?? '';
    },

    set(value) {
      replaceQuery({
        [QUERY_KEYS.period]: value || undefined,
      });
    },
  });

  const sortBy = computed<DatasetSort>({
    get() {
      return route.query[QUERY_KEYS.sort] === 'rows' ? 'rows' : null;
    },

    set(value) {
      replaceQuery({
        [QUERY_KEYS.sort]: value ?? undefined,
      });
    },
  });

  const sortOrder = computed<DatasetSortOrder>({
    get() {
      return route.query[QUERY_KEYS.order] === 'desc' ? 'desc' : 'asc';
    },

    set(value) {
      replaceQuery({
        [QUERY_KEYS.order]: value,
      });
    },
  });

  return {
    types,
    status,
    period,
    sortBy,
    sortOrder,
    setSort,
    resetFilters,
  };
}
