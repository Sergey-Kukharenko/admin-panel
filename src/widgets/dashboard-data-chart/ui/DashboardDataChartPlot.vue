<script setup lang="ts">
import { AppChartGrid } from '@/shared/ui/app-chart-grid';

import type { DataVolumeChartView } from '../model/types';

defineProps<{
  chart: DataVolumeChartView;
}>();
</script>

<template>
  <AppChartGrid :ticks="chart.ticks" :date-labels="chart.dateLabels">
    <!-- Figma BarChart "Container" 1322:142122: columns from 48px to 8px before the edge with 16px
         gaps, from the top line (8px) to 1px above the 0 line: column height = total / axisMax, at
         least 1px so a tiny day next to a big one stays visible. One color whatever the data types,
         as in frames 1322:142113 / 1361:147668 (stats/bets-daily); the breakdown by type is the
         tooltip (RFC, WT-328). Radius 2px: the Bar item has a raw radius, no Figma variable -->
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
  </AppChartGrid>
</template>
