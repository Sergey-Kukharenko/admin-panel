<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { AppButton } from '@/shared/ui/app-button';
import { UploadsEmptyState } from '@/widgets/uploads-empty-state';

import { useDatasetHistoryTable } from '../model';
import DatasetHistoryGroupContent from './DatasetHistoryGroupContent.vue';
import DatasetHistoryGroupHeader from './DatasetHistoryGroupHeader.vue';
import DatasetHistoryGroupSkeleton from './DatasetHistoryGroupSkeleton.vue';
import DatasetHistoryPagination from './DatasetHistoryPagination.vue';
import DatasetHistoryTableHeader from './DatasetHistoryTableHeader.vue';
import DatasetHistoryTableSkeleton from './DatasetHistoryTableSkeleton.vue';
import DatasetHistoryToolbar from './DatasetHistoryToolbar.vue';

defineOptions({
  name: 'DatasetHistoryTable',
});

const { t } = useI18n({ useScope: 'global' });

const emit = defineEmits<{
  openUploadDrawer: [];
  'update:hasHistory': [value: boolean];
}>();

const {
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
} = useDatasetHistoryTable();

watch(showHistoryTable, (value) => emit('update:hasHistory', value), { immediate: true });

function handleResetFilters(): void {
  filters.resetFilters();
}
</script>

<template>
  <UploadsEmptyState v-if="!showHistoryTable" @upload="emit('openUploadDrawer')" />

  <div v-else class="mx-auto flex flex-col items-start gap-4 self-stretch relative w-full">
    <DatasetHistoryTableSkeleton v-if="isTemplatesLoading" />

    <template v-else>
      <div
        v-if="isFetching && !isLoading"
        class="absolute top-2 right-2 text-xs text-(--text-secondary) animate-pulse font-mono"
      >
        {{ t('datasets.table.updating') }}
      </div>

      <DatasetHistoryToolbar
        v-model:types="filters.types.value"
        v-model:status="filters.status.value"
        v-model:period="filters.period.value"
        @open-upload="emit('openUploadDrawer')"
      />

      <div class="flex w-full flex-col gap-1 self-stretch">
        <DatasetHistoryTableHeader />

        <DatasetHistoryGroupSkeleton v-if="isLoading" />

        <div
          v-else-if="renderedGroups.length === 0"
          class="flex w-full flex-col items-center gap-4 py-16 text-center"
        >
          <div class="flex flex-col gap-1">
            <p class="text-sm font-medium text-(--text-primary)">{{ t('datasets.table.emptyNotFound.title') }}</p>
            <p class="text-sm text-(--text-secondary)">{{ t('datasets.table.emptyNotFound.description') }}</p>
          </div>

          <AppButton variant="secondary" size="small" @click="handleResetFilters">
            {{ t('datasets.table.emptyNotFound.resetButton') }}
          </AppButton>
        </div>

        <template v-else>
          <!-- Список групп файлов. TransitionGroup сглаживает появление/исчезновение
               целых day-групп при смене фильтров (ключ — дата), чтобы список не
               «схлопывался» рывком, когда отфильтрованный результат короче исходного. -->
          <TransitionGroup
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-(--collapsible-content-max-height) opacity-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="max-h-(--collapsible-content-max-height) opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div
              v-for="group in renderedGroups"
              :key="group.id"
              class="flex w-full flex-col items-center overflow-hidden rounded-(--radius-xl) bg-(--bg-surface-neutral) self-stretch mb-1"
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
                    :sort-by="filters.sortBy.value"
                    :sort-order="filters.sortOrder.value"
                  />
                </div>
              </Transition>
            </div>
          </TransitionGroup>

          <DatasetHistoryPagination
            v-model:page="page"
            v-model:perPage="perPage"
            :total-items="totalItems"
            :rendered-count="renderedGroups.length"
          />
        </template>
      </div>
    </template>
  </div>
</template>
