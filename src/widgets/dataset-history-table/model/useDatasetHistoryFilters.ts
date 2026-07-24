import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { QUERY_KEYS } from './queryKeys';
import type { DatasetPeriod, DatasetSort, DatasetSortOrder, DatasetStatus } from './types';

export function useDatasetHistoryFilters() {
  const route = useRoute();
  const router = useRouter();

  function replaceQuery(values: Record<string, string | string[] | undefined>) {
    // 1. Создаем чистую копию текущих параметров URL
    const nextQuery = { ...route.query };

    // 2. Накатываем новые значения параметров
    Object.entries(values).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        // Если параметр сброшен или массив пуст — полностью удаляем ключ из URL
        delete nextQuery[key];
      } else if (Array.isArray(value)) {
        // ⚡ ВАЖНО: Если пришел массив (множественный выбор), принудительно склеиваем в плоскую строку.
        // Это предотвращает баг Vue Router, когда он затирает массив и оставляет только последний элемент.
        nextQuery[key] = value.join(',');
      } else {
        nextQuery[key] = String(value);
      }
    });

    // 3. Дополнительно зачищаем старые пустые параметры, если они застряли в route.query
    Object.keys(nextQuery).forEach((key) => {
      if (!nextQuery[key]) {
        delete nextQuery[key];
      }
    });

    // 4. Обновляем URL в браузере
    router.replace({
      query: nextQuery,
    });
  }

  function setSort(by: DatasetSort, order: DatasetSortOrder) {
    replaceQuery({
      [QUERY_KEYS.sort]: by ?? undefined,
      [QUERY_KEYS.order]: by ? order : undefined,
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
  };
}
