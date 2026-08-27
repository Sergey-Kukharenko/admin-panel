<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';

import { AppSkeleton } from '@/shared/ui/app-skeleton';

defineOptions({
  name: 'DatasetHistoryGroupSkeleton',
});

const FILE_ROWS_COUNT = 6;
</script>

<template>
  <div
    class="mb-1 flex w-full flex-col items-center overflow-hidden rounded-(--radius-xl) bg-(--bg-surface-neutral) self-stretch"
  >
    <div class="flex h-12 w-full items-center gap-3 px-6">
      <ChevronDown class="size-4 shrink-0 text-(--icon-muted)" stroke-width="2.5" />

      <AppSkeleton class="h-3 w-32 rounded-(--radius-sm)" />

      <div class="flex gap-1">
        <AppSkeleton class="h-5.75 w-[54px] rounded-(--radius-full)" />
        <AppSkeleton class="h-5.75 w-[82px] rounded-(--radius-full)" />
      </div>
    </div>

    <div class="flex w-full flex-col gap-2 px-2 pb-2">
      <div class="flex w-full flex-col overflow-hidden rounded-(--radius-lg) bg-(--surface)">
        <div class="flex h-11 w-full items-center border-b border-(--border-default) pl-4">
          <div class="flex flex-1 items-center gap-2">
            <AppSkeleton class="size-4 rounded-(--radius-sm)" />
            <AppSkeleton class="h-4 w-24 rounded-(--radius-sm)" />
          </div>
        </div>

        <div
          v-for="n in FILE_ROWS_COUNT"
          :key="n"
          class="flex w-full items-center border-b border-(--border-default) last:border-b-0"
        >
          <div class="flex h-11 flex-1 items-center border-r border-(--border-default) pl-10 pr-4">
            <AppSkeleton class="h-3 w-full max-w-[180px] rounded-(--radius-sm)" />
          </div>

          <div class="flex h-11 w-40 items-center border-r border-(--border-default) pl-4">
            <AppSkeleton class="h-3 w-16 rounded-(--radius-sm)" />
          </div>

          <div class="flex h-11 w-40 items-center pl-4">
            <AppSkeleton class="h-5.75 w-20 rounded-(--radius-full)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
