<script setup lang="ts">
import { AppSkeleton } from '@/shared/ui/app-skeleton';

defineOptions({
  name: 'PredictionProcessingScheduleSkeleton',
});

const ITEMS_COUNT = 4;
</script>

<template>
  <aside
    class="w-[332px] shrink-0 flex flex-col gap-3 rounded-(--radius-xl) bg-[var(--bg-surface-neutral)] pb-4 pt-2"
  >
    <div class="flex items-center justify-between px-5 pt-2">
      <AppSkeleton class="h-4 w-36 rounded-(--radius-sm)" />
      <AppSkeleton class="h-4 w-20 rounded-(--radius-sm)" />
    </div>

    <div class="flex flex-col gap-2 px-2">
      <div
        v-for="item in ITEMS_COUNT"
        :key="item"
        class="flex h-[60px] items-center gap-3 rounded-(--radius-lg) bg-[var(--bg-surface-primary)] p-2"
      >
        <AppSkeleton class="h-full w-8 shrink-0 rounded-(--radius-sm)" />

        <div class="flex flex-1 flex-col gap-1.5">
          <AppSkeleton class="h-3 w-3/4 rounded-(--radius-sm)" />
          <AppSkeleton class="h-3 w-1/2 rounded-(--radius-sm)" />
        </div>
      </div>
    </div>
  </aside>
</template>
