import { type Query, useQuery } from '@tanstack/vue-query';
import { computed, ref, watch } from 'vue';

import type { FetchFilesBackendResponse } from '@/entities/dataset';
import { datasetApi, useDatasetTemplates } from '@/entities/dataset';

import { mapUiStatusToBackend } from './statusMapping';
import { useDatasetHistoryFilters } from './useDatasetHistoryFilters';
import { getPeriodDates } from './utils';

const HISTORY_QUERY_KEY = 'dataset-history';
const AWAITING_FILES_POLL_INTERVAL_MS = 4000;

export function useDatasetHistoryTable() {
  const filters = useDatasetHistoryFilters();
  const { data: templatesResponse, isSuccess: isTemplatesLoaded } = useDatasetTemplates();

  const limit = ref(20);
  const offset = ref(0);
  const expandedGroups = ref<string[]>([]);

  const orderByParam = computed(() => {
    if (filters.sortBy.value === 'rows') {
      return filters.sortOrder.value === 'desc' ? '-rows_count' : 'rows_count';
    }
    return '-uploaded_at,-created_at';
  });

  // Сбрасываем стейт при изменении фильтров
  watch([() => filters.types.value, () => filters.status.value, () => filters.period.value], () => {
    offset.value = 0;
    expandedGroups.value = [];
  });

  const {
    data: serverResponse,
    isLoading,
    isFetching,
  } = useQuery<FetchFilesBackendResponse>({
    queryKey: [
      HISTORY_QUERY_KEY,
      () => filters.types.value.join(','),
      () => filters.status.value,
      () => filters.period.value,
      () => orderByParam.value,
      () => limit.value,
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
          limit: limit.value,
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

  // Авто-раскрытие самой первой (свежей) группы, как только приходят данные
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
        const source = (datasetGroups[0]?.files[0]?.source_type ?? 'CSV').replace('_', ' ');

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

  function handleSortRows() {
    if (filters.sortBy.value !== 'rows') {
      filters.setSort('rows', 'asc');
      return;
    }
    filters.setSort('rows', filters.sortOrder.value === 'asc' ? 'desc' : 'asc');
  }

  return {
    filters,
    renderedGroups,
    isLoading,
    isFetching,
    expandedGroups,
    toggleGroup,
    handleSortRows,
  };
}
