<script setup lang="ts">
import { Calendar, ChevronDown, FileText, PieChart } from 'lucide-vue-next';

import { AppButton } from '@/shared/ui/AppButton';

defineOptions({
  name: 'DatasetHistoryToolbar',
});

defineEmits<{
  openUpload: []; // Событие клика на кнопку «Загрузить CSV»
}>();
</script>

<template>
  <!-- Table Section: выравнивание по центру, распределение по краям -->
  <div class="flex items-center justify-between w-full self-stretch">
    <!-- Status Cards Container: блок с фильтрами, gap: 8px -->
    <div class="flex items-center gap-2 flex-1">
      <!-- Фильтр 1: Тип данных -->
      <button
        type="button"
        class="flex h-8 min-h-8 max-h-8 pl-3 pr-2 py-1.5 justify-center items-center gap-1.5 rounded-(--radius-sm) border border-black/8 bg-white hover:bg-(--muted) transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--primary)"
      >
        <FileText class="size-4 text-[rgba(48,48,50,0.68)] flex-shrink-0" stroke-width="2" />
        <span class="text-sm font-medium text-[#18181B] leading-5 select-none"> Тип данных </span>
        <ChevronDown class="size-4 text-[rgba(48,48,50,0.98)] flex-shrink-0" stroke-width="2" />
      </button>

      <!-- Фильтр 2: Статус -->
      <button
        type="button"
        class="flex h-8 min-h-8 max-h-8 pl-3 pr-2 py-1.5 justify-center items-center gap-1.5 rounded-(--radius-sm) border border-black/8 bg-white hover:bg-(--muted) transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--primary)"
      >
        <PieChart class="size-4 text-[rgba(48,48,50,0.68)] flex-shrink-0" stroke-width="2" />
        <span class="text-sm font-medium text-[#18181B] leading-5 select-none"> Статус </span>
        <ChevronDown class="size-4 text-[rgba(48,48,50,0.98)] flex-shrink-0" stroke-width="2" />
      </button>

      <!-- Фильтр 3: Период -->
      <button
        type="button"
        class="flex h-8 min-h-8 max-h-8 pl-3 pr-2 py-1.5 justify-center items-center gap-1.5 rounded-(--radius-sm) border border-black/8 bg-white hover:bg-(--muted) transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--primary)"
      >
        <Calendar class="size-4 text-[rgba(48,48,50,0.68)] flex-shrink-0" stroke-width="2" />
        <span class="text-sm font-medium text-[#18181B] leading-5 select-none"> Период </span>
        <ChevronDown class="size-4 text-[rgba(48,48,50,0.98)] flex-shrink-0" stroke-width="2" />
      </button>
    </div>

    <!-- Кнопка действия: Загрузить CSV -->
    <!-- Используем нашу AppButton, перебивая её высоту до 32px (!h-8) и паддинги по спецификации Figma -->
    <div class="flex-shrink-0">
      <AppButton
        variant="primary"
        size="small"
        class="!h-8 !px-3 !gap-1.5 text-[#FCFCFC] rounded-(--radius-sm)"
        @click="emit('openUpload')"
      >
        Загрузить CSV
      </AppButton>
    </div>
  </div>
</template>
