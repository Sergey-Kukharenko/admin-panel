<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { AppChartGrid } from '@/shared/ui/app-chart-grid';
import { AppChartTooltip, AppChartTooltipLayer } from '@/shared/ui/app-chart-tooltip';

import type { DataVolumeChartView } from '../model/types';

const props = defineProps<{
  chart: DataVolumeChartView;
}>();

const { t } = useI18n({ useScope: 'global' });

// the layer spans the columns with half a gap on each side, so every column takes an equal cell and
// its center is the center of the cell. The layer box follows the column box below: left-10 (40px) =
// pl-12 (48px) − gap-4 / 2 (8px), right-0 = pr-2 (8px) − gap-4 / 2. Changing the padding or the gap
// of the columns means changing the layer box too
const positions = computed(() =>
  props.chart.bars.map((_, index) => ((index + 0.5) / props.chart.bars.length) * 100),
);
const disabled = computed(() => props.chart.bars.map((bar) => bar.tooltip === null));
// a period without uploads has nothing to show: no focusable chart that would stay silent
const hasTooltips = computed(() => disabled.value.includes(false));
</script>

<template>
  <AppChartGrid :ticks="chart.ticks" :date-labels="chart.dateLabels">
    <!-- Figma BarChart "Container" 1322:142122: columns from 48px to 8px before the edge with 16px
         gaps, from the top line (8px) to 1px above the 0 line: column height = total / axisMax, at
         least 1px so a tiny day next to a big one stays visible. One color whatever the data types,
         as in frames 1322:142113 / 1361:147668 (stats/bets-daily); the breakdown by type is the
         tooltip (RFC, WT-328). Radius 2px: the Bar item has a raw radius, no Figma variable -->
    <div
      class="absolute inset-x-0 top-2 bottom-6.25 flex items-end gap-4 pr-2 pl-12"
      aria-hidden="true"
    >
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

    <!-- the tooltip of a column (Figma 1323:162549): the day and every data type; none on a hatched
         day (WT-328) -->
    <AppChartTooltipLayer
      v-if="hasTooltips"
      class="absolute top-2 right-0 bottom-6.25 left-10"
      :positions="positions"
      :disabled="disabled"
      :label="t('dashboard.dataChart.plotLabel')"
      :describe="(index) => chart.bars[index]?.tooltip?.description ?? ''"
    >
      <template #default="{ index }">
        <AppChartTooltip
          v-if="chart.bars[index]?.tooltip"
          :title="chart.bars[index].tooltip.title"
          :rows="chart.bars[index].tooltip.rows"
        />
      </template>
    </AppChartTooltipLayer>
  </AppChartGrid>
</template>
