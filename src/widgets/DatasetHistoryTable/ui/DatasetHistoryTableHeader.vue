<script setup lang="ts">
import { ChevronsUpDown } from 'lucide-vue-next';

defineOptions({
  name: 'DatasetHistoryTableHeader',
});

// Определяем события сортировки, если они понадобятся в будущем
const emit = defineEmits<{
  sortRows: [];
  sortStatus: [];
}>();
</script>

<template>
  <!-- Content Container & Header -->
  <!-- Округлая плашка: высота 36px складывается из высоты элементов, фон rgba(48, 48, 50, 0.03) -->
  <div class="flex items-center w-full px-2 bg-[rgba(48,48,50,0.03)] rounded-t-xl self-stretch">
    <!-- 1. Ячейка: НАИМЕНОВАНИЕ (Занимает всю оставшуюся ширину) -->
    <!-- h-9 дает 36px, pl-10 дает 40px, pr-4 дает 16px -->
    <div class="flex h-9 pl-10 pr-4 items-center gap-1.5 flex-1 border-r border-black/8">
      <span
        class="font-mono text-xs font-medium text-[rgba(48,48,50,0.68)] leading-5 uppercase select-none"
      >
        Наименование
      </span>
    </div>

    <!-- 2. Ячейка: ОБЪЁМ СТРОК (Фиксированная ширина 160px) -->
    <button
      type="button"
      class="flex w-[160px] h-9 px-4 items-center gap-1.5 border-r border-black/8 hover:bg-[rgba(48,48,50,0.02)] transition-colors text-left focus-visible:outline-none"
      @click="emit('sortRows')"
    >
      <span
        class="font-mono text-xs font-medium text-[rgba(48,48,50,0.68)] leading-5 uppercase select-none"
      >
        Объём строк
      </span>
      <!-- Иконка сортировки: строго 14x14px, цвет с прозрачностью 68% -->
      <ChevronsUpDown
        class="size-[14px] flex-shrink-0 text-[rgba(48,48,50,0.68)]"
        stroke-width="2"
      />
    </button>

    <!-- 3. Ячейка: СТАТУС (Фиксированная ширина 160px, БЕЗ разделителя border-r справа) -->
    <button
      type="button"
      class="flex w-[160px] h-9 px-4 items-center gap-1.5 hover:bg-[rgba(48,48,50,0.02)] transition-colors text-left focus-visible:outline-none"
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
