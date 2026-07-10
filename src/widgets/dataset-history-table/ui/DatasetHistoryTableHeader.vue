<script setup lang="ts">
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-vue-next';

import type { DatasetSort, DatasetSortOrder } from '../model/types';

defineOptions({
  name: 'DatasetHistoryTableHeader',
});

defineProps<{
  sortBy: DatasetSort;
  sortOrder: DatasetSortOrder;
}>();

const emit = defineEmits<{
  sortRows: [];
}>();
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

    <!-- 2. Ячейка: ОБЪЁМ СТРОК -->
    <button
      type="button"
      class="flex h-9 w-40 cursor-pointer items-center justify-between gap-1.5 border-r border-(--border-subtle) pl-4 pr-3 text-left transition-colors hover:bg-(--muted-hover-soft) focus-visible:outline-none"
      @click="emit('sortRows')"
    >
      <span
        class="font-mono text-xs font-medium uppercase text-(--text-secondary) leading-5 select-none"
      >
        Объём строк
      </span>
      <ArrowUp
        v-if="sortBy === 'rows' && sortOrder === 'asc'"
        class="size-3.5 shrink-0 text-(--text-secondary)"
      />

      <ArrowDown
        v-else-if="sortBy === 'rows' && sortOrder === 'desc'"
        class="size-3.5 shrink-0 text-(--text-secondary)"
      />

      <ChevronsUpDown v-else class="size-3.5 shrink-0 text-(--text-secondary)" />
    </button>

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
