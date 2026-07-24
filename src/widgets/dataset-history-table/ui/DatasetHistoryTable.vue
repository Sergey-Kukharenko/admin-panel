<script setup lang="ts">
import { type Query, useQuery } from '@tanstack/vue-query';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { computed, ref, watch } from 'vue';

import { datasetApi } from '@/entities/dataset';
import type { DatasetGroup, FetchFilesBackendResponse } from '@/entities/dataset/model/api';

import { useDatasetHistoryFilters } from '../model';
import { getPeriodDates } from '../model/utils';
import DatasetHistoryGroupContent from './DatasetHistoryGroupContent.vue';
import DatasetHistoryGroupHeader from './DatasetHistoryGroupHeader.vue';
import DatasetHistoryTableHeader from './DatasetHistoryTableHeader.vue';
import DatasetHistoryToolbar from './DatasetHistoryToolbar.vue';

dayjs.extend(customParseFormat);

defineOptions({
  name: 'DatasetHistoryTable',
});

defineEmits<{
  openUploadDrawer: [];
}>();

const { types, status, period, sortBy, sortOrder } = useDatasetHistoryFilters();
const filtersState = useDatasetHistoryFilters();
const limit = ref(20);
const offset = ref(0);

// Массив раскрытых групп
const expandedGroups = ref<string[]>([]);

const orderByParam = computed(() => {
  if (filtersState.sortBy.value === 'rows') {
    return filtersState.sortOrder.value === 'desc' ? '-rows_count' : 'rows_count';
  }
  return '-uploaded_at,-created_at';
});

const mapUiStatusToBackend = (uiStatus: string) => {
  if (uiStatus === 'SUCCESS') return 'succeeded';
  if (uiStatus === 'ERROR') return 'failed';
  if (uiStatus === 'LOADING') return 'awaiting';
  return undefined;
};

// Сбрасываем стейт при изменении фильтров
watch(
  [
    () => filtersState.types.value,
    () => filtersState.status.value,
    () => filtersState.period.value,
  ],
  () => {
    offset.value = 0;
    expandedGroups.value = [];
  },
);
/**
 * 📡 1. Запрос шаблонов переносим или дублируем в родительский компонент,
 * чтобы контролировать его статус загрузки (isSuccess)
 */
const { data: templatesResponse, isSuccess: isTemplatesLoaded } = useQuery({
  queryKey: ['dataset-templates'],
  queryFn: async () => {
    const response = await datasetApi.getTemplates();
    return response.data;
  },
  staleTime: 1000 * 60 * 15,
});

/**
 * 📡 2. Запрос истории файлов
 */
/**
 * 📡 Строго типизированный запрос к бэкенду с конвертацией имен в UUID на лету
 */
const {
  data: serverResponse,
  isLoading,
  isFetching,
} = useQuery<FetchFilesBackendResponse>({
  queryKey: [
    'dataset-history',
    computed(() => filtersState.types.value.join(',')),
    computed(() => String(filtersState.status.value)),
    computed(() => String(filtersState.period.value)),
    orderByParam,
    limit,
    offset,
  ],
  queryFn: async () => {
    const { gte, lte } = getPeriodDates(filtersState.period.value);
    const backendStatus = filtersState.status.value
      ? mapUiStatusToBackend(filtersState.status.value)
      : undefined;

    // 1. Нормализуем имена из URL в массив
    const currentTypeNames = Array.isArray(filtersState.types.value)
      ? filtersState.types.value
      : filtersState.types.value
        ? String(filtersState.types.value).split(',')
        : [];

    // 2. НА ЛЕТУ: Переводим текстовые имена из URL в массив UUID для бэкенда
    const cachedTemplates = templatesResponse.value || [];
    const backendUuids = cachedTemplates
      .filter((tpl) => currentTypeNames.includes(tpl.name))
      .map((tpl) => tpl.dataset_type_id);

    // 🚀 Вызываем API: склеиваем UUID в плоскую строку через запятую под требования FastAPI
    const response = await datasetApi.getFiles({
      limit: limit.value,
      offset: offset.value,
      order_by: orderByParam.value,
      dataset_type_id__in: backendUuids.length ? backendUuids.join(',') : undefined,
      status__in: backendStatus || undefined,
      uploaded_at__gte: gte,
      uploaded_at__lte: lte,
    });

    // Чистый возврат: типы совпадают идеально, компилятор доволен
    return response.data;
  },

  placeholderData: (previousData) => previousData,
  // Ждем загрузки шаблонов, чтобы маппер UUID отработал безошибочно при первой загрузке страницы
  enabled: isTemplatesLoaded,

  refetchInterval: (
    query: Query<FetchFilesBackendResponse, Error, FetchFilesBackendResponse, readonly unknown[]>,
  ): number | undefined => {
    const queryData = query.state.data;

    // Вместо false возвращаем undefined для отключения опроса
    if (!queryData || !queryData.items) return undefined;

    const hasAwaitingFiles = queryData.items.some((day) =>
      day.dataset_groups?.some((group) => group.files?.some((file) => file.status === 'awaiting')),
    );

    // Если файлы в обработке — опрашиваем каждые 4000мс, иначе отключаем (undefined)
    return hasAwaitingFiles ? 4000 : undefined;
  },
});

/**
 * ⚡ Исправленное и безопасное авто-раскрытие первой группы
 * Добавлен тип `any`, чтобы обойти баг типизации во встроенных макросах Vite/Vue-типов для watch
 */
watch(
  serverResponse,
  (newData: FetchFilesBackendResponse | undefined) => {
    // Если бэк вернул пустой массив или данные отсутствуют — принудительно очищаем раскрытые вкладки
    if (!newData?.items || newData.items.length === 0) {
      expandedGroups.value = [];
      return;
    }

    // Если вкладки пусты, а данные успешно пришли — раскрываем самую первую свежую дату в таблице
    if (newData.items.length > 0 && expandedGroups.value.length === 0) {
      const firstGroupDate = newData.items.at(0)?.uploaded_at;
      if (firstGroupDate) {
        expandedGroups.value = [firstGroupDate];
      }
    }
  },
  { immediate: true, deep: true },
);

/**
 * 📊 Подсчет количества завершенных обработок файлов на основе ФАКТИЧЕСКОГО массива
 */
const getUploadedCount = (datasetGroups: DatasetGroup[]): number => {
  return datasetGroups.reduce(
    (acc, g) => acc + g.files.filter((f) => ['succeeded', 'failed'].includes(f.status)).length,
    0,
  );
};

/**
 * 📊 Подсчет общего количества файлов на основе ФАКТИЧЕСКОГО массива (вместо g.files_count)
 */
const getTotalCount = (datasetGroups: DatasetGroup[]): number => {
  return datasetGroups.reduce((acc, g) => acc + g.files.length, 0);
};

/**
 * 🛠️ 3. Сборка групп для рендеринга (Используем templatesResponse реактивно)
 */
const renderedGroups = computed(() => {
  if (!serverResponse.value?.items) return [];

  const currentTypeNames = Array.isArray(filtersState.types.value)
    ? filtersState.types.value
    : filtersState.types.value
      ? String(filtersState.types.value).split(',')
      : [];

  return serverResponse.value.items
    .map((group) => {
      const activeGroups = group.dataset_groups
        .map((g) => {
          let filteredFiles = [...g.files];

          if (filtersState.status.value) {
            filteredFiles = filteredFiles.filter(
              (f) => mapUiStatusToBackend(filtersState.status.value) === f.status,
            );
          }

          if (currentTypeNames.length && !currentTypeNames.includes(g.dataset_type)) {
            filteredFiles = [];
          }

          return {
            ...g,
            files: filteredFiles,
          };
        })
        .filter((g) => g.files.length > 0);

      // ⚡ ИСПРАВЛЕНО: activeGroups — это массив. Извлекаем первый объект через [0]
      const firstGroup = activeGroups[0];
      // ⚡ Теперь TypeScript видит объект группы и разрешает прочитать массив файлов
      const firstFile = firstGroup?.files?.[0];
      const rawSource = firstFile?.source_type || 'CSV';

      return {
        id: group.uploaded_at,
        date: group.uploaded_at,
        uploadedCount: getUploadedCount(activeGroups),
        totalCount: getTotalCount(activeGroups),
        source: rawSource.replace('_', ' '),
        datasetGroups: activeGroups,
      };
    })
    .filter((dayGroup) => dayGroup.totalCount > 0);
});

function toggleGroup(id: string) {
  if (expandedGroups.value.includes(id)) {
    expandedGroups.value = expandedGroups.value.filter((g) => g !== id);
  } else {
    expandedGroups.value.push(id);
  }
}

function handleSortRows() {
  if (filtersState.sortBy.value !== 'rows') {
    filtersState.setSort('rows', 'asc');
    return;
  }
  filtersState.setSort('rows', filtersState.sortOrder.value === 'asc' ? 'desc' : 'asc');
}
</script>

<template>
  <div class="mx-auto flex flex-col items-start gap-4 self-stretch relative w-full">
    <div
      v-if="isFetching && !isLoading"
      class="absolute top-2 right-2 text-xs text-gray-400 animate-pulse"
    >
      Обновление...
    </div>

    <DatasetHistoryToolbar
      v-model:types="filtersState.types.value"
      v-model:status="filtersState.status.value"
      v-model:period="filtersState.period.value"
      @open-upload="$emit('openUploadDrawer')"
    />

    <div class="flex w-full flex-col gap-1 self-stretch">
      <DatasetHistoryTableHeader
        :sort-by="filtersState.sortBy.value"
        :sort-order="filtersState.sortOrder.value"
        @sort-rows="handleSortRows"
      />

      <div
        v-if="isLoading"
        class="w-full py-20 flex justify-center items-center text-sm text-gray-400"
      >
        Синхронизация данных с бэкендом...
      </div>

      <div
        v-else-if="renderedGroups.length === 0"
        class="w-full py-16 text-center text-sm text-gray-400 border border-dashed rounded-xl bg-white"
      >
        Ничего не найдено
      </div>

      <!-- ⚡ Очищено: убран конфликтующий v-else, цикл v-for работает автономно -->
      <div
        v-for="group in renderedGroups"
        :key="group.id"
        class="flex w-full flex-col items-center overflow-hidden rounded-xl bg-(--bg-surface-neutral) self-stretch"
      >
        <div class="w-full transition-all duration-150">
          <DatasetHistoryGroupHeader
            :date="group.date"
            :uploaded-count="group.uploadedCount"
            :total-count="group.totalCount"
            :source="group.source"
            :expanded="expandedGroups.includes(group.id)"
            @toggle="toggleGroup(group.id)"
          />
        </div>

        <Transition
          enter-active-class="transition-all duration-300 ease-out overflow-hidden"
          enter-from-class="max-h-0 opacity-0"
          enter-to-class="max-h-(--collapsible-content-max-height) opacity-100"
          leave-active-class="transition-all duration-200 ease-in overflow-hidden"
          leave-from-class="max-h-(--collapsible-content-max-height) opacity-100"
          leave-to-class="max-h-0 opacity-0"
        >
          <div v-if="expandedGroups.includes(group.id)" class="w-full">
            <DatasetHistoryGroupContent
              :dataset-groups="group.datasetGroups"
              :group-date="group.date"
              :sort-by="sortBy"
              :sort-order="sortOrder"
              :types="types"
              :status="status"
              :period="period"
            />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
