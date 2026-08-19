<script setup lang="ts">
import { Check, ChevronDown } from 'lucide-vue-next';
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'radix-vue';
import { computed, reactive, ref } from 'vue';

import { TARIFF_USAGE_LIMITS } from '@/entities/tariff';

import { DATA_CHART_BY_PRODUCT, DATA_CHART_SERIES } from '../model/data';
import type { ChartSeriesKey } from '../model/types';
import { StackedBarChart } from './stacked-bar-chart';

defineOptions({
  name: 'DashboardDataChart',
});

const CHART_MAX_VALUE = 200_000;

const selectedProductId = ref(TARIFF_USAGE_LIMITS[0]?.productId ?? '');

const selectedProductName = computed(
  () =>
    TARIFF_USAGE_LIMITS.find((limit) => limit.productId === selectedProductId.value)?.productName ??
    '',
);

const dataset = computed(
  () =>
    DATA_CHART_BY_PRODUCT[selectedProductId.value] ?? {
      totalRows: 0,
      bars: [],
      xAxisLabels: ['', '', ''] as [string, string, string],
    },
);

const visibleSeriesKeys = reactive(new Set<ChartSeriesKey>(DATA_CHART_SERIES.map((series) => series.key)));

function toggleSeries(key: ChartSeriesKey): void {
  if (visibleSeriesKeys.has(key)) {
    visibleSeriesKeys.delete(key);
  } else {
    visibleSeriesKeys.add(key);
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 pt-4">
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-4">
        <div class="flex flex-1 items-center gap-2">
          <p class="font-mono text-xs font-medium text-(--text-secondary) uppercase">
            Загружено данных
          </p>

          <span
            class="rounded-full bg-(--bg-badge-neutral) px-2 py-1 font-mono text-xs font-medium text-(--text-primary) uppercase"
          >
            за 30 дней
          </span>
        </div>

        <DropdownMenuRoot>
          <DropdownMenuTrigger as-child>
            <button
              type="button"
              class="flex h-8 shrink-0 items-center gap-1.5 rounded-(--radius-lg) border border-(--border-default) bg-(--bg-button-secondary) px-3 text-body-sm font-medium text-(--text-primary) transition-colors hover:bg-(--bg-button-secondary-hover)"
            >
              {{ selectedProductName }}
              <ChevronDown class="size-4 text-(--text-primary)" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuPortal>
            <DropdownMenuContent
              :side-offset="4"
              align="end"
              class="w-53 rounded-(--radius-xl) bg-(--surface) p-1 shadow-(--shadow-panel)"
            >
              <DropdownMenuRadioGroup
                :model-value="selectedProductId"
                @update:model-value="selectedProductId = String($event)"
              >
                <DropdownMenuRadioItem
                  v-for="limit in TARIFF_USAGE_LIMITS"
                  :key="limit.productId"
                  :value="limit.productId"
                  class="flex h-8 cursor-pointer items-center justify-between rounded-(--radius-lg) px-3 py-1.5 outline-none hover:bg-(--muted) data-highlighted:bg-(--muted)"
                >
                  <span class="text-sm font-medium text-(--text-primary)">{{ limit.productName }}</span>

                  <Check
                    v-if="selectedProductId === limit.productId"
                    class="size-4 text-(--text-secondary)"
                  />
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      </div>

      <div class="flex flex-col">
        <p class="text-element-accent leading-8 tracking-tight text-(--text-primary)">
          {{ dataset.totalRows.toLocaleString('ru-RU') }}
        </p>
        <p class="text-body-sm text-(--text-secondary)">Строк</p>
      </div>
    </div>

    <StackedBarChart
      :bars="dataset.bars"
      :series="DATA_CHART_SERIES"
      :visible-series-keys="visibleSeriesKeys"
      :max-value="CHART_MAX_VALUE"
      :x-axis-labels="dataset.xAxisLabels"
    />

    <div class="flex flex-wrap items-center gap-5">
      <button
        v-for="series in DATA_CHART_SERIES"
        :key="series.key"
        type="button"
        class="flex items-center gap-2"
        @click="toggleSeries(series.key)"
      >
        <span
          class="flex size-4 items-center justify-center rounded-(--radius-md) shadow-(--shadow-field)"
          :style="{
            backgroundColor: visibleSeriesKeys.has(series.key) ? `var(${series.colorVar})` : 'var(--muted)',
          }"
        >
          <Check
            v-if="visibleSeriesKeys.has(series.key)"
            class="size-2.5 text-(--bg-surface-primary)"
            :stroke-width="3"
          />
        </span>

        <span class="text-body-sm font-medium text-(--text-primary)">{{ series.label }}</span>
      </button>
    </div>
  </div>
</template>
