import type { ChartSeriesDef, DataChartBar, DataChartDataset } from './types';

export const DATA_CHART_SERIES: ChartSeriesDef[] = [
  { key: 'bets', label: 'bets', colorVar: '--stats-bets' },
  { key: 'users', label: 'users', colorVar: '--stats-users' },
  { key: 'betsDaily', label: 'bets-daily', colorVar: '--stats-bets-daily' },
  { key: 'balanceDaily', label: 'balance-daily', colorVar: '--stats-balance-daily' },
  { key: 'payments', label: 'payments', colorVar: '--stats-payments' },
  { key: 'vipUsers', label: 'vip-users', colorVar: '--stats-vip-users' },
];

const BAR_COUNT = 24;

function buildBars(
  populated: Record<number, { tooltipLabel: string; values: DataChartBar['values'] }>,
): DataChartBar[] {
  return Array.from({ length: BAR_COUNT }, (_, index) => {
    const entry = populated[index];

    return {
      id: `bar-${index}`,
      tooltipLabel: entry?.tooltipLabel ?? '',
      values: entry?.values ?? null,
    };
  });
}

export const DATA_CHART_BY_PRODUCT: Record<string, DataChartDataset> = {
  'vip-intelligence': {
    totalRows: 208_200,
    xAxisLabels: ['12 мая', '24 мая', '12 июня'],
    bars: buildBars({
      8: {
        tooltipLabel: '18 мая',
        values: { bets: 60_000, users: 45_000, betsDaily: 15_000, balanceDaily: 10_000, payments: 8_000, vipUsers: 12_000 },
      },
      13: {
        tooltipLabel: '23 мая',
        values: { bets: 55_000, users: 50_000, betsDaily: 20_000, balanceDaily: 12_000, payments: 10_000, vipUsers: 15_000 },
      },
    }),
  },
  'recommender-system': {
    totalRows: 176_450,
    xAxisLabels: ['12 мая', '24 мая', '12 июня'],
    bars: buildBars({
      6: {
        tooltipLabel: '17 мая',
        values: { bets: 40_000, users: 38_000, betsDaily: 12_000, balanceDaily: 9_000, payments: 7_000, vipUsers: 8_000 },
      },
      16: {
        tooltipLabel: '27 мая',
        values: { bets: 48_000, users: 42_000, betsDaily: 14_000, balanceDaily: 10_000, payments: 9_000, vipUsers: 11_000 },
      },
    }),
  },
};
