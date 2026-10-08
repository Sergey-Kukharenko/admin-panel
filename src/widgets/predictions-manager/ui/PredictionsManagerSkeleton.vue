<script setup lang="ts">
import { AppSkeleton } from '@/shared/ui/app-skeleton';

defineOptions({
  name: 'PredictionsManagerSkeleton',
});

const SECTIONS_COUNT = 2;
const CARDS_PER_SECTION = 4;
</script>

<template>
  <div class="flex w-full flex-col items-start gap-16">
    <section
      v-for="section in SECTIONS_COUNT"
      :key="section"
      class="flex w-full flex-col items-start gap-3"
    >
      <AppSkeleton class="h-2.5 w-32 rounded-(--radius-sm)" />

      <div
        class="grid w-full grid-cols-[repeat(auto-fill,minmax(max(420px,calc((100%-24px)/2)),1fr))] gap-x-6 gap-y-3"
      >
        <div
          v-for="card in CARDS_PER_SECTION"
          :key="card"
          class="min-h-32 w-full flex flex-col gap-3 rounded-(--radius-xl) bg-(--bg-surface-neutral) px-2 pb-2 pt-3"
        >
          <div class="flex items-center gap-3 px-1">
            <AppSkeleton class="size-7 shrink-0 rounded-(--radius-full)" />
            <AppSkeleton class="h-3 flex-1 rounded-(--radius-sm)" />
          </div>

          <AppSkeleton class="h-14 w-full rounded-(--radius-lg)" />
        </div>
      </div>
    </section>
  </div>
</template>
