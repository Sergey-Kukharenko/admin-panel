import { type Query, useQuery } from '@tanstack/vue-query';
import { computed, ref, watch } from 'vue';

import type { FetchFilesBackendResponse } from '@/entities/dataset';
import { DATASET_HISTORY_QUERY_KEY, datasetApi, useDatasetTemplates } from '@/entities/dataset';

import { mapUiStatusToBackend } from './statusMapping';
import { useDatasetHistoryFilters } from './useDatasetHistoryFilters';
import { useDatasetHistoryPagination } from './useDatasetHistoryPagination';
import { getPeriodDates } from './utils';

const AWAITING_FILES_POLL_INTERVAL_MS = 4000;

export function useDatasetHistoryTable() {
  const filters = useDatasetHistoryFilters();
  const { page, perPage } = useDatasetHistoryPagination();
  const {
    data: templatesResponse,
    isSuccess: isTemplatesLoaded,
    isLoading: isTemplatesLoading,
  } = useDatasetTemplates();

  const expandedGroups = ref<string[]>([]);

  const offset = computed(() => (page.value - 1) * perPage.value);

  const totalItems = computed(() => serverResponse.value?.total_count ?? 0);

  const orderByParam = computed(() => {
    if (filters.sortBy.value === 'rows') {
      return filters.sortOrder.value === 'desc' ? '-rows_count' : 'rows_count';
    }
    return '-uploaded_at,-created_at';
  });

  // Смена фильтров возвращает список к первой странице
  // ⚡ Сравниваем types через join(','), а не по ссылке на массив: filters.types.value
  // на каждый доступ возвращает новый массив (split(',')), из-за чего watch по ссылке
  // срабатывал на любое изменение route.query (в т.ч. смену страницы) и зацикливал сброс page
  watch(
    [() => filters.types.value.join(','), () => filters.status.value, () => filters.period.value],
    () => {
      page.value = 1;
      expandedGroups.value = [];
    },
  );

  // Переход на другую страницу (в т.ч. из-за смены размера страницы) сворачивает группы предыдущей страницы
  watch(page, () => {
    expandedGroups.value = [];
  });

  const {
    data: serverResponse,
    isLoading,
    isFetching,
  } = useQuery<FetchFilesBackendResponse>({
    queryKey: [
      DATASET_HISTORY_QUERY_KEY,
      // Используем функции-геттеры для реактивного отслеживания фильтров в ключе запроса
      () => filters.types.value.join(','),
      () => filters.status.value,
      () => filters.period.value,
      () => orderByParam.value,
      () => perPage.value,
      () => offset.value,
    ],
    queryFn: async ({ signal }) => {
      const { gte, lte } = getPeriodDates(filters.period.value);
      const backendStatus = mapUiStatusToBackend(filters.status.value);

      const cachedTemplates = templatesResponse.value || [];
      const backendUuids = cachedTemplates
        .filter((tpl) => filters.types.value.includes(tpl.name))
        .map((tpl) => tpl.dataset_type_id);

      const response = await datasetApi.getFiles(
        {
          limit: perPage.value,
          offset: offset.value,
          order_by: orderByParam.value,
          dataset_type_id__in: backendUuids.length ? backendUuids.join(',') : undefined,
          status__in: backendStatus,
          uploaded_at__gte: gte,
          uploaded_at__lte: lte,
        },
        signal,
      );

      return response.data;
    },
    placeholderData: (previousData) => previousData,
    enabled: isTemplatesLoaded,

    refetchInterval: (
      query: Query<FetchFilesBackendResponse, Error, FetchFilesBackendResponse, readonly unknown[]>,
    ): number | undefined => {
      const queryData = query.state.data;
      if (!queryData?.items) return undefined;

      const hasAwaitingFiles = queryData.items.some((day) =>
        day.dataset_groups?.some((group) =>
          group.files?.some((file) => file.status === 'awaiting'),
        ),
      );

      return hasAwaitingFiles ? AWAITING_FILES_POLL_INTERVAL_MS : undefined;
    },
  });

  // Фильтры по умолчанию (ничего не выбрано) — только в этом случае решаем,
  // показывать ли пустой экран вместо таблицы. Если пользователь сам сузил
  // список фильтрами и результат пуст, это не «нет истории», а «нет совпадений»,
  // и должно обрабатываться существующим сообщением «Ничего не найдено».
  const isDefaultFilters = computed(
    () =>
      filters.types.value.length === 0 && filters.status.value === '' && filters.period.value === '',
  );

  const hasTemplates = computed(() => (templatesResponse.value?.length ?? 0) > 0);
  const hasFiles = computed(() => totalItems.value > 0);

  // Пока не пришёл ответ ни по шаблонам, ни по файлам — не показываем пустой экран,
  // чтобы он не мелькал перед тем, как данные реально подтвердят его необходимость.
  const isInitialLoading = computed(() => isTemplatesLoading.value || isLoading.value);

  const showHistoryTable = computed(() => {
    if (!isDefaultFilters.value) return true;
    if (isInitialLoading.value) return true;
    return hasTemplates.value && hasFiles.value;
  });

  watch(
    serverResponse,
    (newData) => {
      if (!newData?.items || newData.items.length === 0) {
        expandedGroups.value = [];
        return;
      }

      if (expandedGroups.value.length === 0) {
        const firstGroupDate = newData.items.at(0)?.uploaded_at;
        if (firstGroupDate) {
          expandedGroups.value = [firstGroupDate];
        }
      }
    },
    { immediate: true },
  );

  const renderedGroups = computed(() => {
    if (!serverResponse.value?.items) return [];

    return serverResponse.value.items
      .map((dayGroup) => {
        const datasetGroups = dayGroup.dataset_groups.filter((group) => group.files.length > 0);

        const uploadedCount = datasetGroups.reduce(
          (acc, group) =>
            acc +
            group.files.filter((file) => ['succeeded', 'failed'].includes(file.status)).length,
          0,
        );
        const totalCount = datasetGroups.reduce((acc, group) => acc + group.files.length, 0);

        const firstFile = datasetGroups[0]?.files?.[0];
        const source = (firstFile?.source_type ?? 'CSV').replace('_', ' ');

        return {
          id: dayGroup.uploaded_at,
          date: dayGroup.uploaded_at,
          uploadedCount,
          totalCount,
          source,
          datasetGroups,
        };
      })
      .filter((dayGroup) => dayGroup.totalCount > 0);
  });

  function toggleGroup(id: string) {
    if (expandedGroups.value.includes(id)) {
      expandedGroups.value = expandedGroups.value.filter((groupId) => groupId !== id);
    } else {
      expandedGroups.value.push(id);
    }
  }

  return {
    filters,
    renderedGroups,
    isLoading,
    isFetching,
    isTemplatesLoading,
    expandedGroups,
    toggleGroup,
    page,
    perPage,
    totalItems,
    showHistoryTable,
  };
}
