<script setup lang="ts">
import type { ApexOptions, ApexTooltipCustomOpts } from 'apexcharts';
import { computed, onMounted, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

import type { PredictionSeries } from '../../model/types';

defineOptions({
  name: 'PredictionsLineChart',
});

const props = defineProps<{
  series: PredictionSeries[];
  maxValue: number;
}>();

const chartOptions = ref<ApexOptions | null>(null);

const apexSeries = computed(() =>
  props.series.map((series) => ({
    name: series.productName,
    data: series.points.map((point) => point.value),
  })),
);

function readToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function buildEdgeAnnotations(colors: string[]): NonNullable<ApexOptions['annotations']>['points'] {
  const points: NonNullable<ApexOptions['annotations']>['points'] = [];

  props.series.forEach((series, seriesIndex) => {
    const lastIndex = series.points.length - 1;

    [0, lastIndex].forEach((pointIndex) => {
      const point = series.points[pointIndex];
      if (!point) return;

      points!.push({
        x: point.label,
        y: point.value,
        seriesIndex,
        marker: {
          size: 4,
          fillColor: readToken('--bg-surface-primary'),
          strokeColor: colors[seriesIndex],
          strokeWidth: 2,
        },
      });
    });
  });

  return points;
}

onMounted(() => {
  const categories = props.series[0]?.points.map((point) => point.label) ?? [];
  const colors = props.series.map((series) => readToken(series.colorVar));
  const borderColor = readToken('--border-default');
  const tertiaryText = readToken('--text-tertiary');
  const overlayBg = readToken('--bg-foreground-overlay');
  const overlayText = readToken('--text-overlay');

  chartOptions.value = {
    chart: {
      type: 'line',
      height: 200,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'inherit',
      dropShadow: { enabled: false },
    },
    colors,
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    markers: {
      size: 0,
      strokeWidth: 0,
      hover: { size: 6 },
    },
    grid: {
      borderColor,
      strokeDashArray: 0,
      padding: { left: 8, right: 8, top: 8 },
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: {
        show: true,
        stroke: { color: borderColor, width: 1, dashArray: 0 },
      },
      labels: {
        style: { colors: tertiaryText, fontSize: '12px' },
        formatter: (value: string) => {
          const index = categories.indexOf(value);

          return index === 0 || index === categories.length - 1 ? value : '';
        },
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
      custom: ({ dataPointIndex, w }: ApexTooltipCustomOpts) => {
        const rows = (w.globals.seriesNames as string[])
          .map((name, index) => {
            const value = w.globals.series[index]?.[dataPointIndex] ?? 0;
            const color = w.globals.colors[index];

            return `<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;">
              <div style="display:flex;align-items:center;gap:8px;min-width:0;">
                <span style="width:8px;height:8px;border-radius:1px;flex-shrink:0;background:${color};display:inline-block;"></span>
                <span style="font-size:12px;white-space:nowrap;">${name}</span>
              </div>
              <span style="font-size:12px;opacity:.7;white-space:nowrap;">${Number(value).toLocaleString('ru-RU')}</span>
            </div>`;
          })
          .join('');

        return `<div style="display:flex;flex-direction:column;gap:4px;background:${overlayBg};color:${overlayText};border-radius:4px;padding:8px 12px;min-width:220px;box-shadow:0 2px 2px rgba(0,0,0,.04),0 1px 1px rgba(0,0,0,.06),0 0 0.5px rgba(0,0,0,.06);">
          <div style="font-size:12px;opacity:.7;">${categories[dataPointIndex] ?? ''}</div>
          ${rows}
        </div>`;
      },
    },
    annotations: {
      points: buildEdgeAnnotations(colors),
    },
  };
});
</script>

<template>
  <VueApexCharts
    v-if="chartOptions"
    type="line"
    height="200"
    :options="chartOptions"
    :series="apexSeries"
  />
</template>
