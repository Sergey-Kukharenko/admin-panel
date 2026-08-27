<script setup lang="ts">
import { AppSkeleton } from '@/shared/ui/app-skeleton';

import DatasetHistoryGroupSkeleton from './DatasetHistoryGroupSkeleton.vue';

defineOptions({
  name: 'DatasetHistoryTableSkeleton',
});
</script>

<template>
  <!-- Тулбар: плейсхолдеры фильтров и кнопки загрузки -->
  <div class="flex w-full items-center justify-between">
    <div class="flex flex-1 items-center gap-2">
      <AppSkeleton v-for="n in 3" :key="n" class="h-8 w-[90px] rounded-(--radius-lg)" />
    </div>

    <div class="shrink-0">
      <AppSkeleton class="h-8 w-[145px] rounded-(--radius-lg)" />
    </div>
  </div>

  <div class="flex w-full flex-col gap-1 self-stretch">
    <!-- Заголовок таблицы -->
    <div
      class="flex w-full items-center rounded-(--radius-xl) bg-(--bg-surface-neutral) pl-6 pr-2 self-stretch"
    >
      <div
        class="flex h-9 flex-1 items-center gap-1.5 border-r border-(--border-subtle) pl-7 pr-4"
      >
        <AppSkeleton class="h-2.5 w-20 rounded-(--radius-sm)" />
      </div>

      <div
        class="flex h-9 w-40 items-center gap-1.5 border-r border-(--border-subtle) pl-4 pr-3"
      >
        <AppSkeleton class="h-2.5 w-20 rounded-(--radius-sm)" />
      </div>

      <div class="flex h-9 w-40 items-center pl-4 pr-3">
        <AppSkeleton class="h-2.5 w-20 rounded-(--radius-sm)" />
      </div>
    </div>

    <!-- Группа за один день -->
    <DatasetHistoryGroupSkeleton />
  </div>
</template>
