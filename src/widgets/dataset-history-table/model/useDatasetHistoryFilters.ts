import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { createQueryPatch } from '@/shared/lib/router/createQueryPatch';

import type { DatasetPeriod, DatasetSort, DatasetSortOrder, DatasetStatus } from './types';
import { URL_PARAMS } from './urlParams';

export function useDatasetHistoryFilters() {
  const route = useRoute();
  const router = useRouter();
  const replaceQuery = createQueryPatch(route, router);

  function setSort(by: DatasetSort, order: DatasetSortOrder) {
    replaceQuery({
      [URL_PARAMS.sort]: by ?? undefined,
      [URL_PARAMS.order]: by ? order : undefined,
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
      [URL_PARAMS.types]: undefined,
      [URL_PARAMS.status]: undefined,
      [URL_PARAMS.period]: undefined,
    });
  }

  const types = computed<string[]>({
    get() {
      const value = route.query[URL_PARAMS.types];

      if (!value) {
        return [];
      }

      return value.toString().split(',');
    },

    set(value) {
      replaceQuery({
        [URL_PARAMS.types]: value.length ? value.join(',') : undefined,
      });
    },
  });

  const status = computed<DatasetStatus | ''>({
    get() {
      return (route.query[URL_PARAMS.status] as DatasetStatus) ?? '';
    },

    set(value) {
      replaceQuery({
        [URL_PARAMS.status]: value || undefined,
      });
    },
  });

  const period = computed<DatasetPeriod | ''>({
    get() {
      return (route.query[URL_PARAMS.period] as DatasetPeriod) ?? '';
    },

    set(value) {
      replaceQuery({
        [URL_PARAMS.period]: value || undefined,
      });
    },
  });

  const sortBy = computed<DatasetSort>({
    get() {
      return route.query[URL_PARAMS.sort] === 'rows' ? 'rows' : null;
    },

    set(value) {
      replaceQuery({
        [URL_PARAMS.sort]: value ?? undefined,
      });
    },
  });

  const sortOrder = computed<DatasetSortOrder>({
    get() {
      return route.query[URL_PARAMS.order] === 'desc' ? 'desc' : 'asc';
    },

    set(value) {
      replaceQuery({
        [URL_PARAMS.order]: value,
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
