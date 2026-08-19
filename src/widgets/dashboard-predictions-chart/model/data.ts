import type { PredictionsChartDataset } from './types';

const MONTHS = Array.from({ length: 12 }, (_, index) => `month-${index}`);

function buildPoints(values: number[]) {
  return MONTHS.map((month, index) => ({ month, value: values[index] ?? 0 }));
}

export const PREDICTIONS_CHART_DATASET: PredictionsChartDataset = {
  totalRowsByProduct: {
    'vip-intelligence': 282_219,
    'recommender-system': 194_530,
  },
  xAxisLabels: ['май, 2026', 'июн, 2026'],
  series: [
    {
      productId: 'vip-intelligence',
      productName: 'VIP Intelligence',
      colorVar: '--stats-users',
      points: buildPoints([
        20_000, 34_000, 41_000, 57_000, 74_000, 89_000, 108_000, 128_000, 149_000, 164_000, 177_000,
        189_000,
      ]),
    },
    {
      productId: 'recommender-system',
      productName: 'Recommender System',
      colorVar: '--stats-payments',
      points: buildPoints([
        12_000, 18_000, 22_000, 30_000, 41_000, 52_000, 64_000, 77_000, 90_000, 101_000, 112_000,
        121_000,
      ]),
    },
  ],
};
