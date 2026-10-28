<script setup lang="ts">
import type { AppChartGridProps } from './AppChartGrid.types';

defineProps<AppChartGridProps>();
</script>

<template>
  <div data-chart-grid class="relative h-59">
    <!-- Chart grid of the mockup (Figma BarChart 1322:142122, Linechart 1323:161280): 236px, five
         16px value rows 51px apart (the layout is built for five ticks), labels right aligned in
         30px, dashed line from 38px, dates in the last 16px. The plot goes into the default slot,
         positioned by the consumer over the rows. The axis and the dates are hidden from screen readers;
         the slot is not: a chart tooltip layer in it is the accessible part of the chart -->
    <div class="flex h-55 flex-col justify-between" aria-hidden="true">
      <div
        v-for="tick in ticks"
        :key="tick.value"
        data-chart-tick
        class="flex h-4 items-center gap-2"
      >
        <span class="w-7.5 shrink-0 text-right text-body-xs text-(--text-secondary)">
          {{ tick.label }}
        </span>
        <!-- Figma draws the stroke centered on the row middle (8px) in the 7th pixel row; centering a
             1px element would start it at 7.5px and Chrome snaps it a row lower -->
        <span class="mt-1.75 h-px flex-1 self-start bg-(image:--bg-chart-grid-line)" />
      </div>
    </div>

    <div
      class="absolute inset-x-0 bottom-0 flex h-4 justify-between pr-1 pl-10 text-body-xs text-(--text-secondary)"
      aria-hidden="true"
    >
      <!-- positional labels: two can be the same text (a period of one or two days) -->
      <span v-for="(label, index) in dateLabels" :key="index" data-chart-date>{{ label }}</span>
    </div>

    <slot />
  </div>
</template>
