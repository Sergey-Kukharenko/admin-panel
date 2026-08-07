<script setup lang="ts">
import { AppSkeleton } from '@/shared/ui/app-skeleton';

defineOptions({
  name: 'PredictionRunHistorySkeleton',
});

const ROWS_COUNT = 5;
</script>

<template>
  <div class="w-full overflow-clip rounded-[var(--radius-md)] border border-(--border-default)">
    <div class="flex h-9 w-full items-center gap-4 bg-(--bg-surface-neutral) px-4">
      <AppSkeleton class="h-2.5 w-12 rounded" />
      <AppSkeleton class="h-2.5 flex-1 rounded" />
      <AppSkeleton class="h-2.5 flex-1 rounded" />
      <AppSkeleton class="h-2.5 flex-1 rounded" />
      <AppSkeleton class="h-2.5 flex-1 rounded" />
      <AppSkeleton class="h-2.5 w-16 rounded" />
      <AppSkeleton class="h-2.5 w-16 rounded" />
    </div>

    <div class="flex w-full flex-col divide-y divide-(--border-default)">
      <div v-for="n in ROWS_COUNT" :key="n" class="flex h-11 w-full items-center gap-4 px-4">
        <AppSkeleton class="h-3 w-12 rounded" />
        <AppSkeleton class="h-3 flex-1 rounded" />
        <AppSkeleton class="h-3 flex-1 rounded" />
        <AppSkeleton class="h-3 flex-1 rounded" />
        <AppSkeleton class="h-3 flex-1 rounded" />
        <AppSkeleton class="h-5.75 w-16 rounded-full" />
        <AppSkeleton class="h-3 w-16 rounded" />
      </div>
    </div>
  </div>
</template>
