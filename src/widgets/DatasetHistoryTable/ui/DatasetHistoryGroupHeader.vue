<script setup lang="ts">
import { ChevronDown, FileText, PieChart } from 'lucide-vue-next';

defineOptions({
  name: 'DatasetHistoryGroupHeader',
});

defineProps<{
  date: string;
  uploadedCount: number;
  totalCount: number;
  source: string;
  expanded: boolean;
}>();

defineEmits<{
  toggle: [];
}>();
</script>

<template>
  <!-- Зафиксирован px-6 для выравнивания с шапкой таблицы -->
  <button
    type="button"
    class="flex w-full h-12 px-6 items-center text-left focus-visible:outline-none"
    @click="$emit('toggle')"
  >
    <!-- Левая колонка: Наименование (pl-6 компенсирует шеврон) -->
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <div class="flex items-center gap-2 shrink-0">
        <ChevronDown
          :class="[
            'size-4 text-[rgba(48,48,50,0.98)] transition-transform duration-200',
            { '-rotate-90': !expanded },
          ]"
          stroke-width="2.5"
        />
      </div>
      <span class="text-sm font-medium text-[rgba(48,48,50,0.98)] leading-5 select-none truncate">
        {{ date }}
      </span>
    </div>

    <!-- Средняя колонка: Объём строк (Строго w-[160px], pl-4) -->
    <div class="flex w-[160px] h-full pl-4 items-center shrink-0">
      <div
        class="flex h-[23px] pl-1.5 pr-2 py-1 items-center gap-0.5 rounded-full bg-[rgba(48,48,50,0.06)] select-none"
      >
        <PieChart class="size-[14px] text-[rgba(48,48,50,0.98)] flex-shrink-0" stroke-width="2" />
        <span
          class="font-mono text-xs font-medium text-[rgba(48,48,50,0.98)] leading-5 uppercase pl-[2px]"
        >
          {{ uploadedCount }}/{{ totalCount }}
        </span>
      </div>
    </div>

    <!-- Правая колонка: Статус (Строго w-[160px], pl-4) -->
    <div class="flex w-[160px] h-full pl-4 items-center shrink-0">
      <div
        class="flex h-[23px] pl-1.5 pr-2 py-1 items-center gap-0.5 rounded-full bg-[rgba(48,48,50,0.06)] select-none"
      >
        <FileText class="size-[14px] text-[rgba(48,48,50,0.98)] flex-shrink-0" stroke-width="2" />
        <span
          class="font-mono text-xs font-medium text-[rgba(48,48,50,0.98)] leading-5 uppercase pl-[2px]"
        >
          Источник:{{ source }}
        </span>
      </div>
    </div>
  </button>
</template>
