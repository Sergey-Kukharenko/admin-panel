<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppChartGrid } from '@/shared/ui/app-chart-grid';
import { AppChartTooltip, AppChartTooltipLayer } from '@/shared/ui/app-chart-tooltip';

import type { ProductChartView } from '../model/types';

defineProps<{
  chart: ProductChartView;
  /** Product name for the accessible name of the chart */
  productName: string;
}>();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <AppChartGrid :ticks="chart.ticks" :date-labels="chart.dateLabels">
    <!-- Figma Linechart 1323:161280 (frames 1322:142194, 1302:140879): lines from the top grid line
         (8px) to the 0 line (212px), points 3px inside the grid so the 6px markers of the first and
         last day stay in it (the mockup starts the lines under the value labels) -->
    <div class="absolute top-2 right-0.75 left-10.25 h-51" aria-hidden="true">
      <svg
        class="absolute inset-0 size-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <!-- straight segments, 1.5px (Figma 1361:147750, 1323:161308); the stroke keeps its width
             while the 100×100 box stretches -->
        <polyline
          v-for="line in chart.lines"
          :key="line.seriesKey"
          class="stroke-(--series-color)"
          :style="{ '--series-color': line.color }"
          :points="line.points.map((point) => `${point.x},${point.y}`).join(' ')"
          fill="none"
          stroke-width="1.5"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />
      </svg>
      <!-- 6px white markers with a 1px stroke of the line color on every day (Figma 1323:161309);
           HTML, not SVG circles: the stretched SVG box would turn circles into ellipses -->
      <!-- the line color is set once per line; display: contents keeps the markers positioned in the
           plot box -->
      <div
        v-for="line in chart.lines"
        :key="line.seriesKey"
        class="contents"
        :style="{ '--series-color': line.color }"
      >
        <span
          v-for="point in line.points"
          :key="point.date"
          data-marker
          class="absolute size-1.5 -translate-1/2 rounded-(--radius-full) border border-(--series-color) bg-(--bg-surface-primary)"
          :style="{ left: `${point.x}%`, top: `${point.y}%` }"
        />
      </div>
    </div>

    <!-- the tooltip of a day with the shown lines (Figma 1323:162588) and the vertical cursor of the
         UI kit line chart (52:3356); none on a chart without data: the zero line has nothing to tell -->
    <AppChartTooltipLayer
      v-if="chart.tooltips.length > 0"
      class="absolute top-2 right-0.75 left-10.25 h-51"
      :positions="chart.positions"
      cursor
      :label="t('dashboard.productCharts.plotLabel', { product: productName })"
      :describe="(index) => chart.tooltips[index]?.description ?? ''"
    >
      <template #default="{ index }">
        <AppChartTooltip
          v-if="chart.tooltips[index]"
          :title="chart.tooltips[index].title"
          :rows="chart.tooltips[index].rows"
        />
      </template>
    </AppChartTooltipLayer>
  </AppChartGrid>
</template>
