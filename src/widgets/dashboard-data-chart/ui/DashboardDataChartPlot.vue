<script setup lang="ts">
import type { DataVolumeChartView } from '../model/types';

defineProps<{
  chart: DataVolumeChartView;
}>();
</script>

<template>
  <!-- Figma BarChart "Container" 1322:142122, 236px: five 16px value rows 51px apart (labels right
       aligned in 30px, dashed line from 38px), dates in the last 16px, columns from 48px to 8px
       before the edge with 16px gaps, standing 1px above the 0 line -->
  <div class="relative h-59" aria-hidden="true">
    <div class="flex h-55 flex-col justify-between">
      <div v-for="tick in chart.ticks" :key="tick.value" class="flex h-4 items-center gap-2">
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
    >
      <!-- positional labels: a short period can give the same date twice -->
      <span v-for="(label, index) in chart.dateLabels" :key="index">{{ label }}</span>
    </div>

    <!-- from the top line (8px) to 1px above the 0 line: column height = total / axisMax, at least
         1px so a tiny day next to a big one stays visible. One color whatever the data types, as in
         frames 1322:142113 / 1361:147668 (stats/bets-daily); the breakdown by type is the tooltip
         (RFC, WT-328). Radius 2px: the Bar item has a raw radius, no Figma variable -->
    <div class="absolute inset-x-0 top-2 bottom-6.25 flex items-end gap-4 pr-2 pl-12">
      <template v-for="bar in chart.bars" :key="bar.date">
        <div
          v-if="bar.total > 0"
          data-chart-bar
          class="min-h-px min-w-0 flex-1 rounded-xs bg-(--stats-bets-daily)"
          :style="{ height: `${(bar.total / chart.axisMax) * 100}%` }"
        />
        <!-- day without uploads: hatched column of the mockup height (Figma Bar item type=empty) -->
        <div
          v-else
          data-chart-bar="empty"
          class="h-37 min-w-0 flex-1 rounded-xs bg-(--bg-chart-empty-bar) bg-(image:--bg-chart-empty-bar-hatch)"
        />
      </template>
    </div>
  </div>
</template>
