<script setup lang="ts">
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  CircleCheck,
  CircleX,
  Download,
  Globe,
  Loader2,
} from 'lucide-vue-next';
import { TooltipArrow, TooltipContent, TooltipRoot, TooltipTrigger } from 'radix-vue';
import { toRef } from 'vue';
import { toast } from 'vue-sonner';

import { useIntegrationsStore } from '@/entities/integration';

import type { PredictionRunRecord, PredictionRunSortField } from '../model/types';
import { useRunHistorySort } from '../model/useRunHistorySort';
import { formatRunRecordsCount, formatRunTimestamp } from '../model/utils';

defineOptions({
  name: 'PredictionRunHistoryTable',
});

const props = defineProps<{
  items: PredictionRunRecord[];
}>();

const emit = defineEmits<{
  download: [item: PredictionRunRecord];
}>();

const { sortField, sortOrder, toggleSort, sortedItems } = useRunHistorySort(toRef(props, 'items'));

const integrationsStore = useIntegrationsStore();

// Для результатов с типом 'api' (продукты секции рекомендаций) кнопка не скачивает файл,
// а копирует токен интеграции в буфер обмена — своего результата для скачивания у API нет
async function handleResultClick(item: PredictionRunRecord) {
  if (item.resultType === 'api') {
    const { clientId } = integrationsStore.getClientCredentials('rest-api');
    await navigator.clipboard.writeText(clientId);
    toast.success('Скопировано');
    return;
  }

  emit('download', item);
}

function sortIconFor(field: PredictionRunSortField) {
  if (sortField.value !== field) return ChevronsUpDown;
  return sortOrder.value === 'asc' ? ChevronUp : ChevronDown;
}

function sortIconClassFor(field: PredictionRunSortField) {
  return sortField.value === field ? 'text-(--icon-primary)' : 'text-(--icon-secondary)';
}
</script>

<template>
  <div class="w-full overflow-clip rounded-(--radius-xl) border border-(--border-default)">
    <!-- HEADER -->
    <div class="flex w-full items-center">
      <button
        type="button"
        class="flex h-9 w-26 shrink-0 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-neutral) px-4 transition-colors hover:bg-(--muted-hover)"
        @click="toggleSort('id')"
      >
        <span class="font-mono text-element-tag font-medium uppercase text-(--text-secondary)">
          ID
        </span>
        <component :is="sortIconFor('id')" class="size-3.5" :class="sortIconClassFor('id')" />
      </button>

      <button
        type="button"
        class="flex h-9 min-w-px flex-1 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-neutral) px-4 transition-colors hover:bg-(--muted-hover)"
        @click="toggleSort('product')"
      >
        <span class="font-mono text-element-tag font-medium uppercase text-(--text-secondary)">
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
        <span class="font-mono text-element-tag font-medium uppercase text-(--text-secondary)">
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
        <span class="font-mono text-element-tag font-medium uppercase text-(--text-secondary)">
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
        <span class="font-mono text-element-tag font-medium uppercase text-(--text-secondary)">
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
        <span class="font-mono text-element-tag font-medium uppercase text-(--text-secondary)">
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
        <span class="font-mono text-element-tag font-medium uppercase text-(--text-secondary)">
          Статус
        </span>
        <component
          :is="sortIconFor('status')"
          class="size-3.5"
          :class="sortIconClassFor('status')"
        />
      </button>

      <div class="flex h-9 w-[91px] shrink-0 items-center gap-1.5 bg-(--bg-surface-neutral) px-4">
        <span class="font-mono text-element-tag font-medium uppercase text-(--text-secondary)">
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
            v-if="item.status === 'ready'"
            class="inline-flex h-5.75 items-center gap-1 rounded-(--radius-full) bg-(--bg-badge-success) py-1 pl-1.5 pr-2"
          >
            <CircleCheck class="size-3.5 text-(--success-alt)" :stroke-width="2" />
            <span class="font-mono text-element-tag font-medium uppercase text-(--success-alt)">
              Ready
            </span>
          </div>

          <div
            v-else-if="item.status === 'generating'"
            class="inline-flex h-5.75 items-center gap-1 rounded-(--radius-full) bg-(--bg-badge-loading) py-1 pl-1.5 pr-2"
          >
            <Loader2 class="size-3.5 animate-spin text-(--icon-loading)" :stroke-width="2" />
            <span class="font-mono text-element-tag font-medium uppercase text-(--icon-loading)">
              Generating
            </span>
          </div>

          <TooltipRoot v-else>
            <TooltipTrigger as-child>
              <div
                class="inline-flex h-5.75 cursor-help items-center gap-1 rounded-(--radius-full) bg-(--bg-badge-danger) py-1 pl-1.5 pr-2"
              >
                <CircleX class="size-3.5 text-(--danger-failed)" :stroke-width="2" />
                <span
                  class="font-mono text-element-tag font-medium uppercase text-(--danger-failed)"
                >
                  Failed
                </span>
              </div>
            </TooltipTrigger>

            <TooltipContent
              side="top"
              :side-offset="6"
              class="z-50 animate-in fade-in-0 zoom-in-95 duration-100 select-none"
            >
              <div
                class="flex flex-col items-center justify-center rounded-(--radius-sm) bg-(--bg-foreground-overlay) px-2 py-1.5 shadow-(--shadow-panel) backdrop-blur-[20px]"
              >
                <p class="text-xs font-normal leading-4 text-(--text-overlay)">Error</p>
              </div>

              <TooltipArrow class="fill-(--bg-foreground-overlay)" :width="8" :height="4" />
            </TooltipContent>
          </TooltipRoot>
        </div>

        <div class="flex h-11 w-[91px] shrink-0 items-center justify-center px-2">
          <button
            v-if="item.resultType"
            type="button"
            :aria-label="item.resultType === 'api' ? 'Скопировать токен интеграции' : 'Скачать CSV'"
            class="flex h-8 max-h-8 min-h-8 items-center justify-center gap-1.5 rounded-(--radius-lg) px-3 py-1.5 text-(--text-secondary) transition-colors hover:bg-(--muted)"
            @click="handleResultClick(item)"
          >
            <component :is="item.resultType === 'csv' ? Download : Globe" class="size-4" />
            <span class="text-sm font-medium leading-5">
              {{ item.resultType === 'csv' ? 'CSV' : 'API' }}
            </span>
          </button>

          <span
            v-else-if="item.status === 'generating'"
            class="text-center text-xs font-normal leading-4 text-(--text-secondary)"
          >
            Расчет в процессе
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
