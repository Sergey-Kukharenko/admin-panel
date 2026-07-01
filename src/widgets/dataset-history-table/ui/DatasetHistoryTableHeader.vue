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
  <div class="flex w-full items-center rounded-xl bg-[rgba(48,48,50,0.03)] pl-6 pr-2 self-stretch">
    <!-- 1. Ячейка: НАИМЕНОВАНИЕ -->
    <div class="flex h-9 flex-1 items-center gap-1.5 border-r border-black/8 pl-7 pr-4">
      <span
        class="font-mono text-xs font-medium uppercase text-[rgba(48,48,50,0.68)] leading-5 select-none"
      >
        Наименование
      </span>
    </div>

    <!-- 2. Ячейка: ОБЪЁМ СТРОК (Сортировка и иконка сохранены) -->
    <button
      type="button"
      class="flex h-9 w-[160px] cursor-pointer items-center justify-between gap-1.5 border-r border-black/8 pl-4 pr-3 text-left transition-colors hover:bg-[rgba(48,48,50,0.02)] focus-visible:outline-none"
      @click="emit('sortRows')"
    >
      <span
        class="font-mono text-xs font-medium uppercase text-[rgba(48,48,50,0.68)] leading-5 select-none"
      >
        Объём строк
      </span>
      <ArrowUp
        v-if="sortBy === 'rows' && sortOrder === 'asc'"
        class="size-[14px] shrink-0 text-[rgba(48,48,50,0.68)]"
      />

      <ArrowDown
        v-else-if="sortBy === 'rows' && sortOrder === 'desc'"
        class="size-[14px] shrink-0 text-[rgba(48,48,50,0.68)]"
      />

      <ChevronsUpDown v-else class="size-[14px] shrink-0 text-[rgba(48,48,50,0.68)]" />
    </button>

    <!-- 3. Ячейка: СТАТУС (ИСПРАВЛЕНО: Теперь это обычный div, иконка стрелочек удалена) -->
    <div class="flex h-9 w-[160px] items-center pl-4 pr-3 text-left">
      <span
        class="font-mono text-xs font-medium uppercase text-[rgba(48,48,50,0.68)] leading-5 select-none"
      >
        Статус
      </span>
    </div>
  </div>
</template>
