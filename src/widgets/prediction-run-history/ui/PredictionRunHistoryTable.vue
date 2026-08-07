<script setup lang="ts">
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  CircleCheck,
  CircleX,
  Download,
} from 'lucide-vue-next';
import { toRef } from 'vue';

import type { PredictionRunRecord, PredictionRunSortField } from '../model/types';
import { useRunHistorySort } from '../model/useRunHistorySort';
import { formatRunRecordsCount, formatRunTimestamp } from '../model/utils';

defineOptions({
  name: 'PredictionRunHistoryTable',
});

const props = defineProps<{
  items: PredictionRunRecord[];
}>();

defineEmits<{
  download: [item: PredictionRunRecord];
}>();

const { sortField, sortOrder, toggleSort, sortedItems } = useRunHistorySort(toRef(props, 'items'));

function sortIconFor(field: PredictionRunSortField) {
  if (sortField.value !== field) return ChevronsUpDown;
  return sortOrder.value === 'asc' ? ChevronUp : ChevronDown;
}

function sortIconClassFor(field: PredictionRunSortField) {
  return sortField.value === field ? 'text-(--icon-primary)' : 'text-(--icon-secondary)';
}
</script>

<template>
  <div class="w-full overflow-clip rounded-[var(--radius-md)] border border-(--border-default)">
    <!-- HEADER -->
    <div class="flex w-full items-center">
      <button
        type="button"
        class="flex h-9 w-26 shrink-0 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-neutral) px-4 transition-colors hover:bg-(--muted-hover)"
        @click="toggleSort('id')"
      >
        <span class="font-mono text-xs font-medium uppercase leading-5 text-(--text-secondary)">
          ID
        </span>
        <component :is="sortIconFor('id')" class="size-3.5" :class="sortIconClassFor('id')" />
      </button>

      <button
        type="button"
        class="flex h-9 min-w-px flex-1 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-neutral) px-4 transition-colors hover:bg-(--muted-hover)"
        @click="toggleSort('product')"
      >
        <span class="font-mono text-xs font-medium uppercase leading-5 text-(--text-secondary)">
          Продукт
        </span>
        <component
          :is="sortIconFor('product')"
          class="size-3.5"
          :class="sortIconClassFor('product')"
        />
      </button>

      <button
        type="button"
        class="flex h-9 min-w-px flex-1 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-neutral) px-4 transition-colors hover:bg-(--muted-hover)"
        @click="toggleSort('service')"
      >
        <span class="font-mono text-xs font-medium uppercase leading-5 text-(--text-secondary)">
          Сервис
        </span>
        <component
          :is="sortIconFor('service')"
          class="size-3.5"
          :class="sortIconClassFor('service')"
        />
      </button>

      <button
        type="button"
        class="flex h-9 min-w-px flex-1 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-neutral) px-4 transition-colors hover:bg-(--muted-hover)"
        @click="toggleSort('startedAt')"
      >
        <span class="font-mono text-xs font-medium uppercase leading-5 text-(--text-secondary)">
          Начало расчета
        </span>
        <component
          :is="sortIconFor('startedAt')"
          class="size-3.5"
          :class="sortIconClassFor('startedAt')"
        />
      </button>

      <button
        type="button"
        class="flex h-9 min-w-px flex-1 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-neutral) px-4 transition-colors hover:bg-(--muted-hover)"
        @click="toggleSort('finishedAt')"
      >
        <span class="font-mono text-xs font-medium uppercase leading-5 text-(--text-secondary)">
          Завершение расчета
        </span>
        <component
          :is="sortIconFor('finishedAt')"
          class="size-3.5"
          :class="sortIconClassFor('finishedAt')"
        />
      </button>

      <button
        type="button"
        class="flex h-9 w-30 shrink-0 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-neutral) px-4 transition-colors hover:bg-(--muted-hover)"
        @click="toggleSort('recordsCount')"
      >
        <span class="font-mono text-xs font-medium uppercase leading-5 text-(--text-secondary)">
          Записей
        </span>
        <component
          :is="sortIconFor('recordsCount')"
          class="size-3.5"
          :class="sortIconClassFor('recordsCount')"
        />
      </button>

      <button
        type="button"
        class="flex h-9 w-30 shrink-0 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-neutral) px-4 transition-colors hover:bg-(--muted-hover)"
        @click="toggleSort('status')"
      >
        <span class="font-mono text-xs font-medium uppercase leading-5 text-(--text-secondary)">
          Статус
        </span>
        <component
          :is="sortIconFor('status')"
          class="size-3.5"
          :class="sortIconClassFor('status')"
        />
      </button>

      <div class="flex h-9 w-[91px] shrink-0 items-center gap-1.5 bg-(--bg-surface-neutral) px-4">
        <span class="font-mono text-xs font-medium uppercase leading-5 text-(--text-secondary)">
          Результат
        </span>
      </div>
    </div>

    <!-- ROWS -->
    <div class="flex w-full flex-col divide-y divide-(--border-default)">
      <div v-for="item in sortedItems" :key="item.id" class="flex w-full items-center">
        <div
          class="flex h-11 w-26 shrink-0 items-center border-r border-(--border-default) px-4"
          :title="item.id"
        >
          <span class="truncate text-sm font-medium leading-5 text-(--text-primary)">
            {{ item.id.slice(0, 8) }}
          </span>
        </div>

        <div class="flex h-11 min-w-px flex-1 items-center border-r border-(--border-default) px-4">
          <span class="truncate text-sm font-medium leading-5 text-(--text-primary)">
            {{ item.product }}
          </span>
        </div>

        <div class="flex h-11 min-w-px flex-1 items-center border-r border-(--border-default) px-4">
          <span class="truncate text-sm font-medium leading-5 text-(--text-primary)">
            {{ item.service }}
          </span>
        </div>

        <div class="flex h-11 min-w-px flex-1 items-center border-r border-(--border-default) px-4">
          <span class="truncate text-sm font-medium leading-5 text-(--text-primary)">
            {{ formatRunTimestamp(item.startedAt) }}
          </span>
        </div>

        <div class="flex h-11 min-w-px flex-1 items-center border-r border-(--border-default) px-4">
          <span class="truncate text-sm font-medium leading-5 text-(--text-primary)">
            {{ formatRunTimestamp(item.finishedAt) }}
          </span>
        </div>

        <div class="flex h-11 w-30 shrink-0 items-center border-r border-(--border-default) px-4">
          <span class="font-mono text-sm font-medium leading-5 text-(--text-primary)">
            {{ formatRunRecordsCount(item.recordsCount) }}
          </span>
        </div>

        <div class="flex h-11 w-30 shrink-0 items-center border-r border-(--border-default) px-4">
          <div
            class="inline-flex h-5.75 items-center gap-1 rounded-full py-1 pl-1.5 pr-2"
            :class="item.status === 'ready' ? 'bg-(--bg-badge-success)' : 'bg-(--bg-badge-danger)'"
          >
            <CircleCheck
              v-if="item.status === 'ready'"
              class="size-3.5 text-(--success-alt)"
              :stroke-width="2"
            />
            <CircleX v-else class="size-3.5 text-(--danger-failed)" :stroke-width="2" />

            <span
              class="font-mono text-xs font-medium uppercase leading-5"
              :class="item.status === 'ready' ? 'text-(--success-alt)' : 'text-(--danger-failed)'"
            >
              {{ item.status === 'ready' ? 'Ready' : 'Failed' }}
            </span>
          </div>
        </div>

        <div class="flex h-11 w-[91px] shrink-0 items-center justify-center px-2">
          <button
            v-if="item.isDownloadable"
            type="button"
            class="flex h-8 max-h-8 min-h-8 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-1.5 text-(--text-secondary) transition-colors hover:bg-(--muted)"
            @click="$emit('download', item)"
          >
            <Download class="size-4" />
            <span class="text-sm font-medium leading-5">CSV</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
