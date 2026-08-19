<script setup lang="ts">
import type { ChartSeriesDef, DataChartBar } from '../../model/types';

defineOptions({
  name: 'StackedBarChart',
});

const props = defineProps<{
  bars: DataChartBar[];
  series: ChartSeriesDef[];
  visibleSeriesKeys: Set<string>;
  maxValue: number;
  xAxisLabels: [string, string, string];
}>();

const GRID_STEPS = [200_000, 150_000, 100_000, 50_000, 0];

function formatGridLabel(value: number) {
  return value === 0 ? '0' : `${value / 1000}k`;
}

function formatValue(value: number) {
  return value.toLocaleString('ru-RU');
}

function segmentHeightPercent(value: number) {
  return Math.min(100, (value / props.maxValue) * 100);
}

function visibleSeriesFor(bar: DataChartBar) {
  if (!bar.values) return [];

  return props.series.filter(
    (series) => props.visibleSeriesKeys.has(series.key) && bar.values?.[series.key],
  );
}
</script>

<template>
  <div class="flex h-59 gap-2">
    <div
      class="flex w-8 shrink-0 flex-col justify-between text-right text-body-xs text-(--text-tertiary)"
    >
      <span v-for="step in GRID_STEPS" :key="step">{{ formatGridLabel(step) }}</span>
    </div>

    <div class="relative flex flex-1 flex-col">
      <div class="absolute inset-0 flex flex-col justify-between">
        <div v-for="step in GRID_STEPS" :key="step" class="border-t border-(--border-default)" />
      </div>

      <div class="relative flex flex-1 items-end gap-2">
        <div
          v-for="bar in bars"
          :key="bar.id"
          class="group relative flex h-full flex-1 items-end overflow-hidden rounded-[2px]"
        >
          <div
            v-if="bar.values"
            class="flex w-full flex-col items-stretch justify-end gap-0.5"
            style="height: 100%"
          >
            <div
              v-for="series in visibleSeriesFor(bar)"
              :key="series.key"
              class="w-full rounded-[2px]"
              :style="{
                height: `${segmentHeightPercent(bar.values[series.key] ?? 0)}%`,
                backgroundColor: `var(${series.colorVar})`,
              }"
            />
          </div>

          <div
            v-else
            class="h-full w-full rounded-[2px]"
            style="
              background-image: repeating-linear-gradient(
                -45deg,
                var(--border-dash),
                var(--border-dash) 1px,
                transparent 1px,
                transparent 6px
              );
              background-color: var(--bg-surface-neutral);
            "
          />

          <div
            v-if="bar.values"
            class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 rounded-(--radius-sm) bg-(--bg-foreground-overlay) px-2 py-1.5 opacity-0 shadow-(--shadow-panel-short) transition-opacity group-hover:opacity-100"
          >
            <p class="text-body-xs text-(--text-overlay) opacity-70">{{ bar.tooltipLabel }}</p>

            <div
              v-for="series in visibleSeriesFor(bar)"
              :key="series.key"
              class="mt-0.5 flex items-center gap-1.5"
            >
              <span
                class="size-2 shrink-0 rounded-[2px]"
                :style="{ backgroundColor: `var(${series.colorVar})` }"
              />
              <span class="text-body-xs font-medium text-(--text-overlay)">
                {{ series.label }} — {{ formatValue(bar.values?.[series.key] ?? 0) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-2 flex items-center justify-between pl-1 text-body-xs text-(--text-tertiary)">
        <span v-for="label in xAxisLabels" :key="label">{{ label }}</span>
      </div>
    </div>
  </div>
</template>
