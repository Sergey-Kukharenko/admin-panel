<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipRoot, TooltipTrigger } from 'radix-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { toIntlLocale } from '@/shared/i18n';
import { AppIcon, type IconName } from '@/shared/ui/app-icon';

import type {
  PredictionRunRecord,
  PredictionRunSortField,
  PredictionRunSortOrder,
} from '../model/types';
import { formatRunRecordsCount, formatRunTimestamp } from '../model/utils';

defineOptions({
  name: 'PredictionRunHistoryTable',
});

// Сортировка серверная (по всей истории, а не по текущей странице) — состояние приходит
// сверху, таблица только сообщает, по какой колонке кликнули. Сортируются все колонки,
// кроме «Результат»
const props = defineProps<{
  items: PredictionRunRecord[];
  sortField: PredictionRunSortField | null;
  sortOrder: PredictionRunSortOrder;
}>();

const emit = defineEmits<{
  download: [item: PredictionRunRecord];
  sort: [field: PredictionRunSortField];
}>();

// Гибкие колонки делят место поровну (при 1440px — 182px, как в макете) и растут на широких
// экранах. У колонок с датами минимум 182px, как в макете: на узком экране сжимаются «Продукт»
// и «Сервис» (длинные названия обрезаются многоточием), а даты и заголовки остаются целыми.
// Колонка ID по макету 78px — влезает 5 символов product_run_id, полный id — в title ячейки
const RUN_ID_PREVIEW_LENGTH = 5;

const { t, locale } = useI18n({ useScope: 'global' });
const intlLocale = computed(() => toIntlLocale(locale.value));

// По макету (HeaderItem 55:1654): без сортировки — expand-up-down-line, при активной —
// sort-highest (сначала большие, desc) / sort-lowest (сначала меньшие, asc)
function sortIconFor(field: PredictionRunSortField): IconName {
  if (props.sortField !== field) return 'expand-up-down-line';
  return props.sortOrder === 'asc' ? 'sort-lowest' : 'sort-highest';
}

function sortIconClassFor(field: PredictionRunSortField) {
  return props.sortField === field ? 'text-(--icon-primary)' : 'text-(--icon-secondary)';
}
</script>

<template>
  <div class="w-full overflow-clip rounded-(--radius-xl) border border-(--border-default)">
    <!-- HEADER -->
    <div class="flex w-full items-center">
      <button
        type="button"
        class="flex h-9 w-[78px] shrink-0 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-neutral) px-4 transition-colors hover:bg-(--muted-hover)"
        @click="emit('sort', 'runId')"
      >
        <span
          class="whitespace-nowrap font-mono text-element-tag font-medium uppercase text-(--text-secondary)"
        >
          {{ t('predictions.history.columns.id') }}
        </span>
        <AppIcon :name="sortIconFor('runId')" class="size-3.5" :class="sortIconClassFor('runId')" />
      </button>

      <button
        type="button"
        class="flex h-9 min-w-px flex-1 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-neutral) px-4 transition-colors hover:bg-(--muted-hover)"
        @click="emit('sort', 'product')"
      >
        <span
          class="whitespace-nowrap font-mono text-element-tag font-medium uppercase text-(--text-secondary)"
        >
          {{ t('predictions.history.columns.product') }}
        </span>
        <AppIcon
          :name="sortIconFor('product')"
          class="size-3.5"
          :class="sortIconClassFor('product')"
        />
      </button>

      <button
        type="button"
        class="flex h-9 min-w-px flex-1 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-neutral) px-4 transition-colors hover:bg-(--muted-hover)"
        @click="emit('sort', 'service')"
      >
        <span
          class="whitespace-nowrap font-mono text-element-tag font-medium uppercase text-(--text-secondary)"
        >
          {{ t('predictions.history.columns.service') }}
        </span>
        <AppIcon
          :name="sortIconFor('service')"
          class="size-3.5"
          :class="sortIconClassFor('service')"
        />
      </button>

      <button
        type="button"
        class="flex h-9 min-w-[182px] flex-1 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-neutral) px-4 transition-colors hover:bg-(--muted-hover)"
        @click="emit('sort', 'startedAt')"
      >
        <span
          class="whitespace-nowrap font-mono text-element-tag font-medium uppercase text-(--text-secondary)"
        >
          {{ t('predictions.history.columns.startedAt') }}
        </span>
        <AppIcon
          :name="sortIconFor('startedAt')"
          class="size-3.5"
          :class="sortIconClassFor('startedAt')"
        />
      </button>

      <button
        type="button"
        class="flex h-9 min-w-[182px] flex-1 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-neutral) px-4 transition-colors hover:bg-(--muted-hover)"
        @click="emit('sort', 'finishedAt')"
      >
        <span
          class="whitespace-nowrap font-mono text-element-tag font-medium uppercase text-(--text-secondary)"
        >
          {{ t('predictions.history.columns.finishedAt') }}
        </span>
        <AppIcon
          :name="sortIconFor('finishedAt')"
          class="size-3.5"
          :class="sortIconClassFor('finishedAt')"
        />
      </button>

      <button
        type="button"
        class="flex h-9 w-25 shrink-0 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-neutral) px-4 transition-colors hover:bg-(--muted-hover)"
        @click="emit('sort', 'recordsCount')"
      >
        <span
          class="whitespace-nowrap font-mono text-element-tag font-medium uppercase text-(--text-secondary)"
        >
          {{ t('predictions.history.columns.records') }}
        </span>
        <AppIcon
          :name="sortIconFor('recordsCount')"
          class="size-3.5"
          :class="sortIconClassFor('recordsCount')"
        />
      </button>

      <button
        type="button"
        class="flex h-9 w-35 shrink-0 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-neutral) px-4 transition-colors hover:bg-(--muted-hover)"
        @click="emit('sort', 'status')"
      >
        <span
          class="whitespace-nowrap font-mono text-element-tag font-medium uppercase text-(--text-secondary)"
        >
          {{ t('predictions.history.columns.status') }}
        </span>
        <AppIcon
          :name="sortIconFor('status')"
          class="size-3.5"
          :class="sortIconClassFor('status')"
        />
      </button>

      <div class="flex h-9 w-[91px] shrink-0 items-center gap-1.5 bg-(--bg-surface-neutral) px-4">
        <span
          class="whitespace-nowrap font-mono text-element-tag font-medium uppercase text-(--text-secondary)"
        >
          {{ t('predictions.history.columns.result') }}
        </span>
      </div>
    </div>

    <!-- ROWS -->
    <div class="flex w-full flex-col divide-y divide-(--border-default)">
      <div v-for="item in items" :key="item.id" class="flex w-full items-center">
        <div
          class="flex h-11 w-[78px] shrink-0 items-center border-r border-(--border-default) px-4"
          :title="item.runId"
        >
          <span class="truncate text-sm font-medium leading-5 text-(--text-primary)">
            {{ item.runId.slice(0, RUN_ID_PREVIEW_LENGTH) }}
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

        <div
          class="flex h-11 min-w-[182px] flex-1 items-center border-r border-(--border-default) px-4"
        >
          <span class="truncate text-sm font-medium leading-5 text-(--text-primary)">
            {{ formatRunTimestamp(item.startedAt, intlLocale) }}
          </span>
        </div>

        <div
          class="flex h-11 min-w-[182px] flex-1 items-center border-r border-(--border-default) px-4"
        >
          <span class="truncate text-sm font-medium leading-5 text-(--text-primary)">
            {{ formatRunTimestamp(item.finishedAt, intlLocale) }}
          </span>
        </div>

        <div class="flex h-11 w-25 shrink-0 items-center border-r border-(--border-default) px-4">
          <span class="text-sm font-medium leading-5 text-(--text-primary)">
            {{ formatRunRecordsCount(item.recordsCount, intlLocale) }}
          </span>
        </div>

        <div class="flex h-11 w-35 shrink-0 items-center border-r border-(--border-default) px-4">
          <div
            v-if="item.status === 'ready'"
            class="inline-flex h-5.75 items-center gap-1 rounded-(--radius-full) bg-(--bg-badge-success) py-1 pl-1.5 pr-2"
          >
            <AppIcon name="checkbox-circle-line" class="size-3.5 text-(--success-alt)" />
            <span class="font-mono text-element-tag font-medium uppercase text-(--success-alt)">
              {{ t('predictions.history.status.ready') }}
            </span>
          </div>

          <div
            v-else-if="item.status === 'generating'"
            class="inline-flex h-5.75 items-center gap-1 rounded-(--radius-full) bg-(--bg-badge-loading) py-1 pl-1.5 pr-2"
          >
            <AppIcon name="loader-2-line" class="size-3.5 animate-spin text-(--icon-loading)" />
            <span class="font-mono text-element-tag font-medium uppercase text-(--icon-loading)">
              {{ t('predictions.history.status.generating') }}
            </span>
          </div>

          <TooltipRoot v-else>
            <TooltipTrigger as-child>
              <div
                class="inline-flex h-5.75 cursor-help items-center gap-1 rounded-(--radius-full) bg-(--bg-badge-danger) py-1 pl-1.5 pr-2"
              >
                <AppIcon name="close-circle-line" class="size-3.5 text-(--danger-failed)" />
                <span
                  class="font-mono text-element-tag font-medium uppercase text-(--danger-failed)"
                >
                  {{ t('predictions.history.status.failed') }}
                </span>
              </div>
            </TooltipTrigger>

            <TooltipContent
              side="top"
              :side-offset="6"
              class="max-w-56 z-50 animate-in fade-in-0 zoom-in-95 duration-100 select-none"
            >
              <div
                class="flex flex-col items-center justify-center rounded-(--radius-sm) bg-(--bg-foreground-overlay) px-2 py-1.5 shadow-(--shadow-panel) backdrop-blur-[20px]"
              >
                <p
                  class="max-w-56 text-xs font-normal leading-4 text-(--text-overlay) whitespace-pre-line"
                >
                  {{ t('predictions.history.failedTooltip') }}
                </p>
              </div>

              <TooltipArrow class="fill-(--bg-foreground-overlay)" :width="8" :height="4" />
            </TooltipContent>
          </TooltipRoot>
        </div>

        <div class="flex h-11 w-[91px] shrink-0 items-center justify-center px-2">
          <!-- CSV — скачивание файла результата; API — документация сервиса (решение PM, WT-301) -->
          <button
            v-if="item.resultType === 'csv'"
            type="button"
            :aria-label="t('predictions.history.downloadCsvAriaLabel')"
            class="flex h-8 max-h-8 min-h-8 items-center justify-center gap-1.5 rounded-(--radius-lg) px-3 py-1.5 text-(--text-secondary) transition-colors hover:bg-(--muted)"
            @click="emit('download', item)"
          >
            <AppIcon name="download-line" class="size-4" />
            <span class="text-sm font-medium leading-5">CSV</span>
          </button>

          <a
            v-else-if="item.resultType === 'api'"
            :href="item.apiDocsUrl"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t('predictions.history.openApiDocsAriaLabel')"
            class="flex h-8 max-h-8 min-h-8 items-center justify-center gap-1.5 rounded-(--radius-lg) px-3 py-1.5 text-(--text-secondary) transition-colors hover:bg-(--muted)"
          >
            <AppIcon name="global-line" class="size-4" />
            <span class="text-sm font-medium leading-5">API</span>
          </a>

          <span
            v-else-if="item.status === 'generating'"
            class="text-center text-xs font-normal leading-4 text-(--text-secondary)"
          >
            {{ t('predictions.history.inProgress') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
