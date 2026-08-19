<script setup lang="ts">
import { computed } from 'vue';

import type { PredictionSeries } from '../../model/types';

defineOptions({
  name: 'PredictionsLineChart',
});

const props = defineProps<{
  series: PredictionSeries[];
  maxValue: number;
  xAxisLabels: [string, string];
}>();

const GRID_STEPS = [200_000, 150_000, 100_000, 50_000, 0];

function formatGridLabel(value: number) {
  return value === 0 ? '0' : `${value / 1000}k`;
}

function pointCoords(series: PredictionSeries) {
  const count = series.points.length;

  return series.points.map((point, index) => ({
    x: count > 1 ? (index / (count - 1)) * 100 : 0,
    y: 100 - Math.min(100, (point.value / props.maxValue) * 100),
  }));
}

const seriesLines = computed(() =>
  props.series.map((series) => ({
    series,
    coords: pointCoords(series),
    polylinePoints: pointCoords(series)
      .map(({ x, y }) => `${x},${y}`)
      .join(' '),
  })),
);
</script>

<template>
  <div class="flex h-50 gap-2">
    <div
      class="flex w-8 shrink-0 flex-col justify-between text-right text-body-xs text-(--text-tertiary)"
    >
      <span v-for="step in GRID_STEPS" :key="step">{{ formatGridLabel(step) }}</span>
    </div>

    <div class="relative flex flex-1 flex-col">
      <div class="absolute inset-0 flex flex-col justify-between">
        <div v-for="step in GRID_STEPS" :key="step" class="border-t border-(--border-default)" />
      </div>

      <div class="relative flex-1">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="absolute inset-0 size-full">
          <polyline
            v-for="{ series, polylinePoints } in seriesLines"
            :key="series.productId"
            :points="polylinePoints"
            fill="none"
            :stroke="`var(${series.colorVar})`"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            vector-effect="non-scaling-stroke"
          />

          <template v-for="{ series, coords } in seriesLines" :key="`dots-${series.productId}`">
            <circle
              v-for="(coord, index) in coords"
              :key="index"
              :cx="coord.x"
              :cy="coord.y"
              r="3"
              :fill="`var(${series.colorVar})`"
              vector-effect="non-scaling-stroke"
            />
          </template>
        </svg>
      </div>

      <div class="mt-2 flex items-center justify-between pl-1 text-body-xs text-(--text-tertiary)">
        <span v-for="label in xAxisLabels" :key="label">{{ label }}</span>
      </div>
    </div>
  </div>
</template>
