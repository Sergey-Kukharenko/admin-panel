<script setup lang="ts">
import type { TariffMonthlyUsagePoint } from '@/entities/tariff';

defineOptions({
  name: 'UsageBarChart',
});

const props = defineProps<{
  points: TariffMonthlyUsagePoint[];
  maxValue: number;
  seriesName: string;
}>();

const GRID_STEPS = [200_000, 150_000, 100_000, 50_000, 0];

function formatGridLabel(value: number) {
  return value === 0 ? '0' : `${value / 1000}k`;
}

function formatValue(value: number) {
  return value.toLocaleString('ru-RU');
}

function barHeightPercent(value: number) {
  return Math.min(100, (value / props.maxValue) * 100);
}
</script>

<template>
  <div class="flex h-76 gap-2">
    <div
      class="flex w-8 shrink-0 flex-col justify-between text-right text-body-xs text-(--text-tertiary)"
    >
      <span v-for="step in GRID_STEPS" :key="step">{{ formatGridLabel(step) }}</span>
    </div>

    <div class="relative flex flex-1 flex-col">
      <div class="absolute inset-0 flex flex-col justify-between">
        <div v-for="step in GRID_STEPS" :key="step" class="border-t border-(--border-default)" />
      </div>

      <div class="relative flex flex-1 items-end gap-3">
        <div
          v-for="point in points"
          :key="point.month"
          class="group relative flex h-full flex-1 items-end"
        >
          <div
            v-if="point.value !== null"
            class="w-full rounded-t-[2px] bg-(--stats-users) transition-opacity group-hover:opacity-80"
            :style="{ height: `${barHeightPercent(point.value)}%` }"
          />

          <div
            v-else
            class="h-full w-full rounded-t-[2px]"
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
            v-if="point.value !== null"
            class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 rounded-(--radius-sm) bg-(--bg-foreground-overlay) px-2 py-1.5 opacity-0 shadow-(--shadow-panel-short) transition-opacity group-hover:opacity-100"
          >
            <p class="text-body-xs text-(--text-overlay) opacity-70">{{ point.label }}</p>

            <div class="mt-0.5 flex items-center gap-1.5">
              <span class="size-2 shrink-0 rounded-[2px] bg-(--stats-users)" />
              <span class="text-body-xs font-medium text-(--text-overlay)">
                {{ seriesName }} — {{ formatValue(point.value) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-2 flex gap-3 pl-1">
        <span
          v-for="(point, index) in points"
          :key="point.month"
          class="flex-1 text-center text-body-xs text-(--text-tertiary)"
          :class="index === 0 || index === points.length - 1 ? 'opacity-100' : 'opacity-0'"
        >
          {{ point.label }}
        </span>
      </div>
    </div>
  </div>
</template>
