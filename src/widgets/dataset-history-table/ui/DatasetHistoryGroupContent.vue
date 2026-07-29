<script setup lang="ts">
import { computed } from 'vue';

import type { DatasetGroup } from '@/entities/dataset';
import { DatasetTemplateIcon, getDatasetTypeContent } from '@/entities/dataset';
import { AppStatusBadge } from '@/shared/ui/app-status-badge';

import { mapBackendStatusToUi } from '../model/statusMapping';
import type { DatasetSort, DatasetSortOrder } from '../model/types';
import { useDatasetHistoryGroupErrors } from '../model/useDatasetHistoryGroupErrors';
import DatasetHistoryErrorDialog from './DatasetHistoryErrorDialog.vue';

defineOptions({
  name: 'DatasetHistoryGroupContent',
});

const props = defineProps<{
  datasetGroups: DatasetGroup[];
  sortBy: DatasetSort;
  sortOrder: DatasetSortOrder;
  groupDate: string;
}>();

const errors = useDatasetHistoryGroupErrors(props.groupDate);

/**
 * UI-статус AppStatusBadge отличается по написанию от нашего DatasetStatus
 */
const badgeStatusMap = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

const visibleCategories = computed(() => {
  return props.datasetGroups
    .map((group) => {
      const { title, icon } = getDatasetTypeContent(group.dataset_type);

      const files = group.files.map((file) => {
        const prettyFileName = `${group.dataset_type}.csv`;
        const computedStatus = mapBackendStatusToUi(file.status);

        return {
          id: file.file_id,
          name: prettyFileName,
          rowsCount: file.rows_count,
          status: computedStatus,
          rawFile: {
            ...file,
            name: prettyFileName,
            rowsCount: file.rows_count,
            status: computedStatus,
          },
        };
      });

      if (props.sortBy === 'rows') {
        files.sort((a, b) => {
          const diff = a.rowsCount - b.rowsCount;
          return props.sortOrder === 'desc' ? -diff : diff;
        });
      }

      return {
        id: group.dataset_type,
        title,
        count: files.length,
        icon,
        files,
      };
    })
    .filter((category) => category.files.length > 0);
});
</script>

<template>
  <div v-if="visibleCategories.length" class="flex w-full flex-col gap-2 px-2 pb-2">
    <div
      v-for="category in visibleCategories"
      :key="category.id"
      class="flex w-full flex-col overflow-hidden rounded-lg bg-(--surface)"
    >
      <!-- HEADER -->
      <div class="flex h-11 w-full items-center border-b border-(--border-default) pl-4">
        <div class="flex flex-1 items-center gap-2">
          <DatasetTemplateIcon :icon="category.icon" class="h-4 w-4" />

          <div class="flex items-center gap-1.5">
            <span class="text-sm font-medium text-(--text-primary)">
              {{ category.title }}
            </span>

            <span class="text-sm font-medium text-(--text-quaternary)">
              {{ category.count }}
            </span>
          </div>
        </div>
      </div>

      <!-- FILES -->
      <div
        v-for="file in category.files"
        :key="file.id"
        class="flex w-full items-center border-b border-(--border-default) last:border-b-0 hover:bg-(--muted-hover-soft)"
      >
        <!-- NAME -->
        <div class="flex h-11 flex-1 items-center border-r border-(--border-default) pl-10 pr-4">
          <span class="truncate text-sm font-medium text-(--text-primary)">
            {{ file.name }}
          </span>
        </div>

        <!-- ROWS -->
        <div class="flex h-11 w-40 items-center border-r border-(--border-default) pl-4">
          <span class="font-mono text-sm font-medium text-(--text-primary)">
            {{ file.rowsCount }}
          </span>
        </div>

        <!-- STATUS -->
        <div class="flex h-11 w-40 items-center pl-4">
          <!-- ⚡ Передаем строго оригинальный file.rawFile для контроллера ошибок -->
          <AppStatusBadge
            :status="badgeStatusMap[file.status]"
            :clickable="file.status === 'ERROR'"
            @click="file.status === 'ERROR' && errors.open(file.rawFile, category.title)"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- ERROR DIALOG -->
  <DatasetHistoryErrorDialog
    :open="errors.isOpen.value"
    :details="errors.details.value"
    @close="errors.close"
    @download="errors.download"
  />
</template>
