<script setup lang="ts">
import { computed } from 'vue';

import { DatasetTemplateIcon } from '@/entities/dataset';
import type { UploadedDatasetFile } from '@/entities/dataset/model/api';
import type { DatasetIcon } from '@/entities/dataset/model/types';
import { AppStatusBadge } from '@/shared/ui/app-status-badge';

import type { DatasetPeriod, DatasetSort, DatasetSortOrder, DatasetStatus } from '../model/types';
import { useDatasetHistoryGroupErrors } from '../model/useDatasetHistoryGroupErrors';
import DatasetHistoryErrorDialog from './DatasetHistoryErrorDialog.vue';

defineOptions({
  name: 'DatasetHistoryGroupContent',
});

interface DatasetGroupBackendStructure {
  dataset_type: string;
  files_count: number;
  files: UploadedDatasetFile[];
}

const props = defineProps<{
  datasetGroups: DatasetGroupBackendStructure[];
  sortBy: DatasetSort;
  sortOrder: DatasetSortOrder;
  status: DatasetStatus | '';
  period: DatasetPeriod | '';
  types: string[];
  groupDate: string;
}>();

/**
 * ERROR CONTROLLER
 */
const errors = useDatasetHistoryGroupErrors(props.groupDate);

/**
 * STATUS MAPPING backend -> UI
 */
const statusMap = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

const visibleCategories = computed(() => {
  if (!props.datasetGroups) return [];

  const currentTypeNames = Array.isArray(props.types)
    ? props.types
    : props.types
      ? String(props.types).split(',')
      : [];

  return props.datasetGroups
    .map((group) => {
      let files = group.files.map((file) => {
        const prettyFileName = `${group.dataset_type}.csv`;
        const computedStatus =
          file.status === 'succeeded'
            ? 'SUCCESS'
            : file.status === 'failed'
              ? 'ERROR'
              : ('LOADING' as DatasetStatus);

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

      // Простое и надежное сравнение строк
      if (currentTypeNames.length && !currentTypeNames.includes(group.dataset_type)) {
        files = [];
      }

      if (props.status) {
        files = files.filter((file) => file.status === props.status);
      }

      if (props.sortBy === 'rows') {
        files.sort((a, b) => {
          const diff = a.rowsCount - b.rowsCount;
          return props.sortOrder === 'desc' ? -diff : diff;
        });
      }

      let computedIcon: DatasetIcon = 'bets';
      const typeLower = group.dataset_type.toLowerCase();
      if (typeLower.includes('vip')) computedIcon = 'vip';
      else if (typeLower.includes('user')) computedIcon = 'users';
      else if (typeLower.includes('bet')) computedIcon = 'bets';

      const formattedTitle =
        group.dataset_type.charAt(0).toUpperCase() + group.dataset_type.slice(1).replace('_', ' ');

      return {
        id: group.dataset_type,
        title: formattedTitle,
        count: files.length,
        icon: computedIcon,
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
            :status="statusMap[file.status]"
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
