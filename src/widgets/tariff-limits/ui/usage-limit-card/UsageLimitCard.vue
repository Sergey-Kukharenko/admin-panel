<script setup lang="ts">
import { computed } from 'vue';

import { getTariffUsageVariant, TARIFF_LIMIT_WARNING_CAPTION } from '@/entities/tariff';

defineOptions({
  name: 'UsageLimitCard',
});

const props = defineProps<{
  title: string;
  usedMau: number;
  limitMau: number;
}>();

const VARIANT_CLASSES = {
  default: { caption: 'text-(--text-primary)', bar: 'bg-(--bg-accent)' },
  warning: { caption: 'text-(--text-warning)', bar: 'bg-(--warning-foreground)' },
  danger: { caption: 'text-(--text-error)', bar: 'bg-(--danger-failed)' },
} as const;

const percent = computed(() => (props.limitMau > 0 ? (props.usedMau / props.limitMau) * 100 : 0));

const variant = computed(() => getTariffUsageVariant(percent.value));

const classes = computed(() => VARIANT_CLASSES[variant.value]);

const percentLabel = computed(() => {
  const rounded = Math.round(percent.value * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}%`;
});

function formatMau(value: number) {
  return value.toLocaleString('ru-RU');
}
</script>

<template>
  <div class="flex flex-col gap-8 rounded-(--radius-xl) bg-(--card) p-4">
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between gap-2">
        <p class="text-body-sm font-medium text-(--text-primary)">{{ title }}</p>

        <p v-if="variant !== 'default'" class="text-body-sm" :class="classes.caption">
          {{ TARIFF_LIMIT_WARNING_CAPTION }}
        </p>
      </div>

      <p class="text-element-accent tracking-[-0.5px] text-(--text-primary)">{{ percentLabel }}</p>
    </div>

    <div class="flex flex-col gap-3">
      <div class="h-0.75 w-full overflow-hidden rounded-(--radius-full) bg-(--bg-input)">
        <div
          class="h-full rounded-(--radius-full)"
          :class="classes.bar"
          :style="{ width: `${Math.min(percent, 100)}%` }"
        />
      </div>

      <div class="flex items-center justify-between gap-2">
        <p class="text-body-sm text-(--text-secondary)">MAU за период</p>
        <p class="text-body-sm text-(--text-primary)">
          {{ formatMau(usedMau) }} / {{ formatMau(limitMau) }} MAU
        </p>
      </div>
    </div>
  </div>
</template>
