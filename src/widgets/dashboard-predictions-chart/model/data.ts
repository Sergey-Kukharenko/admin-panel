import type { PredictionsChartDataset } from './types';

const MONTH_LABELS = [
  'Май 2026',
  'Июнь 2026',
  'Июль 2026',
  'Август 2026',
  'Сентябрь 2026',
  'Октябрь 2026',
  'Ноябрь 2026',
  'Декабрь 2026',
  'Январь 2027',
  'Февраль 2027',
  'Март 2027',
  'Апрель 2027',
];

function buildPoints(values: number[]) {
  return MONTH_LABELS.map((label, index) => ({
    month: `month-${index}`,
    label,
    value: values[index] ?? 0,
  }));
}

export const PREDICTIONS_CHART_DATASET: PredictionsChartDataset = {
  totalRowsByProduct: {
    'vip-intelligence': 282_219,
    'recommender-system': 194_530,
  },
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
