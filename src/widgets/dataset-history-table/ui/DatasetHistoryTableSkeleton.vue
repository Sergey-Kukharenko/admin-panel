<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';

import { AppSkeleton } from '@/shared/ui/app-skeleton';

defineOptions({
  name: 'DatasetHistoryTableSkeleton',
});

const FILE_ROWS_COUNT = 6;
</script>

<template>
  <!-- Тулбар: плейсхолдеры фильтров и кнопки загрузки -->
  <div class="flex w-full items-center justify-between">
    <div class="flex flex-1 items-center gap-2">
      <AppSkeleton v-for="n in 3" :key="n" class="h-8 w-[90px] rounded-(--radius-sm)" />
    </div>

    <div class="shrink-0">
      <AppSkeleton class="h-8 w-[145px] rounded-(--radius-sm)" />
    </div>
  </div>

  <div class="flex w-full flex-col gap-1 self-stretch">
    <!-- Заголовок таблицы -->
    <div
      class="flex w-full items-center rounded-xl bg-(--bg-surface-neutral) pl-6 pr-2 self-stretch"
    >
      <div
        class="flex h-9 flex-1 items-center gap-1.5 border-r border-(--border-subtle) pl-7 pr-4"
      >
        <AppSkeleton class="h-2.5 w-20 rounded" />
      </div>

      <div
        class="flex h-9 w-40 items-center gap-1.5 border-r border-(--border-subtle) pl-4 pr-3"
      >
        <AppSkeleton class="h-2.5 w-20 rounded" />
      </div>

      <div class="flex h-9 w-40 items-center pl-4 pr-3">
        <AppSkeleton class="h-2.5 w-20 rounded" />
      </div>
    </div>

    <!-- Группа за один день -->
    <div
      class="mb-1 flex w-full flex-col items-center overflow-hidden rounded-xl bg-(--bg-surface-neutral) self-stretch"
    >
      <div class="flex h-12 w-full items-center gap-3 px-6">
        <ChevronDown class="size-4 shrink-0 text-(--icon-muted)" stroke-width="2.5" />

        <AppSkeleton class="h-3 w-32 rounded" />

        <div class="flex gap-1">
          <AppSkeleton class="h-5.75 w-[54px] rounded-full" />
          <AppSkeleton class="h-5.75 w-[82px] rounded-full" />
        </div>
      </div>

      <div class="flex w-full flex-col gap-2 px-2 pb-2">
        <div class="flex w-full flex-col overflow-hidden rounded-lg bg-(--surface)">
          <!-- Заголовок категории -->
          <div class="flex h-11 w-full items-center border-b border-(--border-default) pl-4">
            <div class="flex flex-1 items-center gap-2">
              <AppSkeleton class="size-4 rounded" />
              <AppSkeleton class="h-4 w-24 rounded" />
            </div>
          </div>

          <!-- Строки файлов -->
          <div
            v-for="n in FILE_ROWS_COUNT"
            :key="n"
            class="flex w-full items-center border-b border-(--border-default) last:border-b-0"
          >
            <div
              class="flex h-11 flex-1 items-center border-r border-(--border-default) pl-10 pr-4"
            >
              <AppSkeleton class="h-3 w-full max-w-[180px] rounded" />
            </div>

            <div class="flex h-11 w-40 items-center border-r border-(--border-default) pl-4">
              <AppSkeleton class="h-3 w-16 rounded" />
            </div>

            <div class="flex h-11 w-40 items-center pl-4">
              <AppSkeleton class="h-5.75 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
