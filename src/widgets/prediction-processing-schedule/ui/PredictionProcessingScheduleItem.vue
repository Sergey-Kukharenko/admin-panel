<script setup lang="ts">
import type { ScheduleEvent } from '../model/types';

defineOptions({
  name: 'PredictionProcessingScheduleItem',
});

defineProps<{
  item: ScheduleEvent;
}>();
</script>

<template>
  <article
    class="w-[306px] h-14 min-h-14 p-2 bg-[var(--bg-surface-primary)] rounded-lg inline-flex justify-start items-center gap-3"
  >
    <div
      class="w-11 self-stretch shrink-0 border-r border-[var(--border-default)] pr-2 inline-flex flex-col justify-center items-center gap-0.5"
    >
      <div
        class="justify-start text-[var(--text-tertiary)] text-sm font-normal font-['Geist'] leading-5"
      >
        {{ item.dayOfWeek }}
      </div>

      <div
        class="text-center justify-start text-[var(--text-primary)] text-lg font-normal font-['Geist_Mono'] leading-5"
      >
        {{ item.dayOfMonth }}
      </div>
    </div>

    <div class="flex-1 min-w-0 inline-flex flex-col justify-start items-start gap-0.5">
      <h3
        class="self-stretch justify-start text-[var(--text-primary)] text-sm font-medium font-['Geist'] leading-5 truncate"
      >
        {{ item.title }}
      </h3>

      <p
        class="justify-start text-[var(--icon-tertiary)] text-sm font-normal font-['Geist'] leading-5"
      >
        {{ item.formattedTime }}
      </p>
    </div>
  </article>
</template>
