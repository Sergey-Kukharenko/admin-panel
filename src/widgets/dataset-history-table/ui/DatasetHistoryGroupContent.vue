<script setup lang="ts">
import dayjs from 'dayjs';
import { computed } from 'vue';

import type { DatasetIcon } from '@/entities/dataset/model/types';
import { DatasetTemplateIcon } from '@/entities/dataset/ui/dataset-template-icon';
import { AppStatusBadge } from '@/shared/ui/app-status-badge';

import type { DatasetPeriod, DatasetSort, DatasetSortOrder, DatasetStatus } from '../model/types';
import { useDatasetHistoryGroupErrors } from '../model/useDatasetHistoryGroupErrors';
import DatasetHistoryErrorDialog from './DatasetHistoryErrorDialog.vue';

defineOptions({
  name: 'DatasetHistoryGroupContent',
});

interface DatasetHistoryFile {
  id: string;
  name: string;
  rowsCount: number;
  status: DatasetStatus;
}

interface DatasetCategory {
  id: string;
  title: string;
  count: number;
  icon: DatasetIcon; // Строго типизируем слаг иконки через тип сущности
  files: DatasetHistoryFile[];
}

const props = defineProps<{
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

/**
 * MOCK DATA
 */
const categoriesMock: DatasetCategory[] = [
  {
    id: 'users',
    title: 'Users',
    count: 2,
    icon: 'users',
    files: [
      { id: '1', name: 'casino_rewards.csv', rowsCount: 7634, status: 'LOADING' },
      { id: '2', name: 'jackpot_winners.csv', rowsCount: 2345, status: 'SUCCESS' },
    ],
  },
  {
    id: 'vip-users',
    title: 'Vip-users',
    count: 1,
    icon: 'vip',
    files: [{ id: '3', name: 'vip_players_list.csv', rowsCount: 5420, status: 'LOADING' }],
  },
  {
    id: 'bets',
    title: 'Bets',
    count: 2,
    icon: 'bets',
    files: [
      { id: '4', name: 'user_bets_daily.csv', rowsCount: 12840, status: 'SUCCESS' },
      { id: '5', name: 'high_rollers_june.csv', rowsCount: 540, status: 'ERROR' },
    ],
  },
];

function checkPeriod(date: string, period: string): boolean {
  if (!period) return true;

  const created = dayjs(date, 'DD MMM YYYY, HH:mm');
  const now = dayjs();

  switch (period) {
    case 'today':
      return created.isSame(now, 'day');
    case 'week':
      return created.isAfter(now.subtract(7, 'day'));
    case 'month':
      return created.isAfter(now.subtract(1, 'month'));
    default:
      return true;
  }
}

const visibleCategories = computed(() => {
  if (!checkPeriod(props.groupDate, props.period)) {
    return [];
  }

  return categoriesMock
    .map((category) => {
      let files = [...category.files];

      if (props.types.length && !props.types.includes(category.id)) {
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

      return {
        ...category,
        count: files.length,
        files,
      };
    })
    .filter((category) => category.files.length);
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
          <!-- Рендерим готовый компонент иконки из сущности датасета -->
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
          <AppStatusBadge
            :status="statusMap[file.status]"
            :clickable="file.status === 'ERROR'"
            @click="file.status === 'ERROR' && errors.open(file, category.title)"
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
