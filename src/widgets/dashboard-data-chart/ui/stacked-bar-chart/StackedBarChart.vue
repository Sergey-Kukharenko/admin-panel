<script setup lang="ts">
import type { ApexOptions, ApexTooltipCustomOpts } from 'apexcharts';
import { onMounted, ref, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

import type { ChartSeriesDef, ChartSeriesKey, DataChartBar } from '../../model/types';

defineOptions({
  name: 'StackedBarChart',
});

const props = defineProps<{
  bars: DataChartBar[];
  series: ChartSeriesDef[];
  visibleSeriesKeys: Set<ChartSeriesKey>;
  maxValue: number;
  xAxisLabels: [string, string, string];
}>();

// Порядок стека снизу вверх — как в макете (vip-users в основании, bets сверху).
const STACK_ORDER: ChartSeriesKey[] = [
  'vipUsers',
  'payments',
  'balanceDaily',
  'betsDaily',
  'users',
  'bets',
];

const EMPTY_SERIES_NAME = '__empty';

const chartOptions = ref<ApexOptions | null>(null);
const apexSeries = ref<ApexOptions['series']>([]);

function readToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function formatValue(value: number): string {
  return value.toLocaleString('ru-RU');
}

function orderedVisibleSeries(): ChartSeriesDef[] {
  return STACK_ORDER.map((key) => props.series.find((series) => series.key === key)).filter(
    (series): series is ChartSeriesDef => Boolean(series) && props.visibleSeriesKeys.has(series!.key),
  );
}

function buildSeries(visible: ChartSeriesDef[]): ApexOptions['series'] {
  const realSeries = visible.map((series) => ({
    name: series.key,
    data: props.bars.map((bar) => bar.values?.[series.key] ?? 0),
  }));

  const emptySeries = {
    name: EMPTY_SERIES_NAME,
    data: props.bars.map((bar) => (bar.values ? 0 : props.maxValue)),
  };

  return [...realSeries, emptySeries];
}

function buildCategories(): string[] {
  const total = props.bars.length;
  const middleIndex = Math.floor((total - 1) / 2);

  return props.bars.map((_, index) => {
    if (index === 0) return props.xAxisLabels[0];
    if (index === middleIndex) return props.xAxisLabels[1];
    if (index === total - 1) return props.xAxisLabels[2];

    return '';
  });
}

function buildOptions(visible: ChartSeriesDef[]): ApexOptions {
  const colors = visible.map((series) => readToken(series.colorVar));
  const emptyColor = readToken('--border-dash');
  const borderColor = readToken('--border-default');
  const tertiaryText = readToken('--text-tertiary');
  const overlayBg = readToken('--bg-foreground-overlay');
  const overlayText = readToken('--text-overlay');
  const surfaceColor = readToken('--bg-surface-primary');

  return {
    chart: {
      type: 'bar',
      height: 236,
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'inherit',
    },
    colors: [...colors, emptyColor],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        columnWidth: '55%',
        borderRadius: 2,
        borderRadiusApplication: 'around',
        borderRadiusWhenStacked: 'all',
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: [surfaceColor],
    },
    fill: {
      type: [...visible.map(() => 'solid'), 'pattern'],
      opacity: [...visible.map(() => 1), 0.6],
      pattern: {
        style: [...visible.map(() => 'solid'), 'slantedLines'],
        width: 4,
        height: 4,
        strokeWidth: 1.5,
      },
    },
    grid: {
      borderColor,
      strokeDashArray: 0,
      padding: { left: 8, right: 8 },
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: buildCategories(),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: tertiaryText, fontSize: '12px' },
        rotate: 0,
        hideOverlappingLabels: false,
        trim: false,
      },
    },
    yaxis: {
      min: 0,
      max: props.maxValue,
      tickAmount: 4,
      labels: {
        style: { colors: tertiaryText, fontSize: '12px' },
        formatter: (value: number) => (value === 0 ? '0' : `${value / 1000}k`),
      },
    },
    legend: { show: false },
    tooltip: {
      shared: true,
      intersect: false,
      custom: ({ dataPointIndex }: ApexTooltipCustomOpts) => {
        const bar = props.bars[dataPointIndex];
        if (!bar?.values) return '';

        const rows = props.series
          .filter((series) => props.visibleSeriesKeys.has(series.key) && bar.values?.[series.key])
          .map((series) => {
            const value = bar.values?.[series.key] ?? 0;
            const color = readToken(series.colorVar);

            return `<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;">
              <div style="display:flex;align-items:center;gap:8px;min-width:0;">
                <span style="width:8px;height:8px;flex-shrink:0;background:${color};display:inline-block;"></span>
                <span style="font-size:12px;white-space:nowrap;">${series.label}</span>
              </div>
              <span style="font-size:12px;opacity:.7;white-space:nowrap;">${formatValue(value)}</span>
            </div>`;
          })
          .join('');

        return `<div style="display:flex;flex-direction:column;gap:4px;background:${overlayBg};color:${overlayText};border-radius:4px;padding:8px 12px;min-width:220px;box-shadow:0 2px 2px rgba(0,0,0,.04),0 1px 1px rgba(0,0,0,.06),0 0 0.5px rgba(0,0,0,.06);">
          <div style="font-size:12px;opacity:.7;">${bar.tooltipLabel}</div>
          ${rows}
        </div>`;
      },
    },
  };
}

function refresh(): void {
  const visible = orderedVisibleSeries();

  apexSeries.value = buildSeries(visible);
  chartOptions.value = buildOptions(visible);
}

// ApexCharts' live updateOptions() doesn't reliably reapply formatter
// functions (e.g. the y-axis "200k" labels revert to raw numbers) — force a
// full remount via :key instead of relying on in-place option merging.
const renderKey = ref(0);

onMounted(refresh);

watch(
  () => [props.bars, Array.from(props.visibleSeriesKeys), props.maxValue, props.xAxisLabels],
  () => {
    refresh();
    renderKey.value += 1;
  },
  { deep: true },
);
</script>

<template>
  <VueApexCharts
    v-if="chartOptions"
    :key="renderKey"
    type="bar"
    height="236"
    :options="chartOptions"
    :series="apexSeries"
  />
</template>
