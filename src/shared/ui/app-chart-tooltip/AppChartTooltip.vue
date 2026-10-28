<script setup lang="ts">
import { computed } from 'vue';

import type { AppChartTooltipProps } from './AppChartTooltip.types';
import { tooltipSwatch } from './swatch';

const props = defineProps<AppChartTooltipProps>();

const swatchedRows = computed(() =>
  props.rows.map((row) => ({ ...row, ...tooltipSwatch(row.color) })),
);
</script>

<template>
  <!-- Figma chart tooltip 55:2287 (UI kit 52:3538): 241px, 8/12px padding, 4px between the date and
       the rows, foreground/overlay fill, shadow-field; every text body/xs text/on-dark, the date and
       the values at 70% layer opacity; no arrow and no total -->
  <div
    data-chart-tooltip
    class="flex w-60.25 flex-col gap-1 rounded-(--radius-sm) bg-(--bg-foreground-overlay) px-3 py-2 text-body-xs text-(--text-on-dark) shadow-(--shadow-field)"
  >
    <p class="opacity-70">{{ title }}</p>
    <div
      v-for="row in swatchedRows"
      :key="row.key"
      data-chart-tooltip-row
      class="flex items-center justify-between gap-2"
    >
      <span class="flex min-w-0 items-center gap-2">
        <!-- 8px square of the series; the white underlay only under the translucent greys and the
             light stroke only around the dark square, as in the mockup -->
        <span
          data-chart-tooltip-swatch
          class="relative size-2 shrink-0"
          :class="row.underlay && 'bg-(--bg-chart-tooltip-swatch)'"
        >
          <!-- the inside stroke lies over the color, as strokeAlign INSIDE in Figma -->
          <span
            class="absolute inset-0 bg-(--series-color)"
            :class="row.outlined && 'ring-1 ring-(--border-chart-tooltip-swatch) ring-inset'"
            :style="{ '--series-color': row.color }"
          />
        </span>
        <span class="truncate">{{ row.label }}</span>
      </span>
      <span class="shrink-0 opacity-70">{{ row.value }}</span>
    </div>
  </div>
</template>
