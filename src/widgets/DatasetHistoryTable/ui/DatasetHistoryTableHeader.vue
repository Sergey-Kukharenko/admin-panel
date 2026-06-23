<script setup lang="ts">
import { ChevronsUpDown } from 'lucide-vue-next';

defineOptions({
  name: 'DatasetHistoryTableHeader',
});

const emit = defineEmits<{
  sortRows: [];
  sortStatus: [];
}>();
</script>

<template>
  <!-- Шапка таблицы: px-6 выравнивает ее по внешним границам таблицы, border-b убран, скругления rounded-xl -->
  <div class="flex items-center w-full px-6 bg-[rgba(48,48,50,0.03)] rounded-xl self-stretch">
    <!-- 1. Ячейка: НАИМЕНОВАНИЕ -->
    <!-- pl-6 дает ровно 24px, чтобы идеально встать по одной линии с шевронами строк ниже. border-right заменен на border-black/8 -->
    <div class="flex h-9 pl-6 pr-4 items-center gap-1.5 flex-1 border-r border-black/8">
      <span
        class="font-mono text-xs font-medium text-[rgba(48,48,50,0.68)] leading-5 uppercase select-none"
      >
        Наименование
      </span>
    </div>

    <!-- 2. Ячейка: ОБЪЁМ СТРОК (Фиксированная ширина 160px) -->
    <!-- Заменен px-4 на pl-4 pr-3 для точного выравнивания чисел по сетке -->
    <button
      type="button"
      class="flex w-[160px] h-9 pl-4 pr-3 items-center justify-between gap-1.5 border-r border-black/8 hover:bg-[rgba(48,48,50,0.02)] transition-colors text-left focus-visible:outline-none cursor-pointer"
      @click="emit('sortRows')"
    >
      <span
        class="font-mono text-xs font-medium text-[rgba(48,48,50,0.68)] leading-5 uppercase select-none"
      >
        Объём строк
      </span>
      <ChevronsUpDown
        class="size-[14px] flex-shrink-0 text-[rgba(48,48,50,0.68)]"
        stroke-width="2"
      />
    </button>

    <!-- 3. Ячейка: СТАТУС (Фиксированная ширина 160px) -->
    <!-- Убран border-r, добавлен pl-4 для ровного отступа бейджей «ЗАГРУЗКА» -->
    <button
      type="button"
      class="flex w-[160px] h-9 pl-4 pr-3 items-center justify-between gap-1.5 hover:bg-[rgba(48,48,50,0.02)] transition-colors text-left focus-visible:outline-none cursor-pointer"
      @click="emit('sortStatus')"
    >
      <span
        class="font-mono text-xs font-medium text-[rgba(48,48,50,0.68)] leading-5 uppercase select-none"
      >
        Статус
      </span>
      <ChevronsUpDown
        class="size-[14px] flex-shrink-0 text-[rgba(48,48,50,0.68)]"
        stroke-width="2"
      />
    </button>
  </div>
</template>
