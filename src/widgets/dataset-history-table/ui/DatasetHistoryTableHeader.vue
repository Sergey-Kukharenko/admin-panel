<script setup lang="ts">
defineOptions({
  name: 'DatasetHistoryTableHeader',
});
</script>

<template>
  <div class="flex w-full items-center rounded-xl bg-(--bg-surface-neutral) pl-6 pr-2 self-stretch">
    <!-- 1. Ячейка: НАИМЕНОВАНИЕ -->
    <div class="flex h-9 flex-1 items-center gap-1.5 border-r border-(--border-subtle) pl-7 pr-4">
      <span
        class="font-mono text-xs font-medium uppercase text-(--text-secondary) leading-5 select-none"
      >
        Наименование
      </span>
    </div>

    <!-- 2. Ячейка: ОБЪЁМ СТРОК (сортировка отключена — бэкенд не поддерживает order_by=rows_count) -->
    <div
      class="flex h-9 w-40 items-center justify-between gap-1.5 border-r border-(--border-subtle) pl-4 pr-3 text-left"
    >
      <span
        class="font-mono text-xs font-medium uppercase text-(--text-secondary) leading-5 select-none"
      >
        Объём строк
      </span>
    </div>

    <!-- 3. Ячейка: СТАТУС -->
    <div class="flex h-9 w-40 items-center pl-4 pr-3 text-left">
      <span
        class="font-mono text-xs font-medium uppercase text-(--text-secondary) leading-5 select-none"
      >
        Статус
      </span>
    </div>
  </div>
</template>
