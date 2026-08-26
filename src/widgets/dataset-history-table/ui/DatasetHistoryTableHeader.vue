<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DatasetHistoryTableHeader',
});

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <div class="flex w-full items-center rounded-(--radius-xl) bg-(--bg-surface-neutral) pl-6 pr-2 self-stretch">
    <!-- 1. Ячейка: НАИМЕНОВАНИЕ -->
    <div class="flex h-9 flex-1 items-center gap-1.5 border-r border-(--border-subtle) pl-7 pr-4">
      <span
        class="font-mono text-element-tag font-medium uppercase text-(--text-secondary) select-none"
      >
        {{ t('datasets.table.header.name') }}
      </span>
    </div>

    <!-- 2. Ячейка: ОБЪЁМ СТРОК (сортировка отключена — бэкенд не поддерживает order_by=rows_count) -->
    <div
      class="flex h-9 w-40 items-center justify-between gap-1.5 border-r border-(--border-subtle) pl-4 pr-3 text-left"
    >
      <span
        class="font-mono text-element-tag font-medium uppercase text-(--text-secondary) select-none"
      >
        {{ t('datasets.table.header.rowCount') }}
      </span>
    </div>

    <!-- 3. Ячейка: СТАТУС -->
    <div
      class="flex h-9 w-40 items-center border-r border-(--border-subtle) pl-4 pr-3 text-left"
    >
      <span
        class="font-mono text-element-tag font-medium uppercase text-(--text-secondary) select-none"
      >
        {{ t('datasets.table.header.status') }}
      </span>
    </div>

    <!-- 4. Ячейка: переход к деталям ошибки (без заголовка, только под иконку-стрелку) -->
    <div class="flex h-9 w-11 shrink-0 items-center justify-center" />
  </div>
</template>
