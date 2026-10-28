import type { ChartSeriesColor } from '@/shared/lib/chart';

// Square color of each data type in the column tooltip (Figma chart tooltip 1323:162549 / 55:2287,
// the stats/* variables); the column itself stays one color.
// TODO: a data type the mockup has no color for gets the neutral grey until the designer adds one
// (asked in WT-325 and WT-328)
export const DATA_TYPE_COLORS: Record<string, ChartSeriesColor> = {
  bets: 'var(--stats-bets)',
  users: 'var(--stats-users)',
  'bets-daily': 'var(--stats-bets-daily)',
  'balance-daily': 'var(--stats-balance-daily)',
  payments: 'var(--stats-payments)',
  'vip-users': 'var(--stats-vip-users)',
};

export const OTHER_DATA_TYPE_COLOR: ChartSeriesColor = 'var(--stats-neutral)';
