import type { ChartSeriesColor } from '@/shared/lib/chart';

// Line colors in the series order of the response, as tokens: the plot paints the line and its
// markers with it (`--series-color`), the legend checkbox takes it as its fill. The mockup has three
// raw colors without variables (Figma 1361:147750): #ACEB5C = stats/users (the first RS scenario,
// Recommended for You, as in the tooltip 1323:162588), #528300 = stats/bets-daily, #A4A5A6
// (--stats-neutral).
// TODO: RS has 4 series and PI up to 7 (RFC 4.3–4.4): until the designer adds a palette (asked in
// WT-326) the next series take the other stats colors, the ones that differ most from the first
// three going first (stats/bets is close to stats/users and comes later)
export const SERIES_COLORS: ChartSeriesColor[] = [
  'var(--stats-users)',
  'var(--stats-bets-daily)',
  'var(--stats-neutral)',
  'var(--stats-vip-users)',
  'var(--stats-bets)',
  'var(--stats-payments)',
  'var(--stats-balance-daily)',
];

/** The zero line of a chart without data (Figma «Нет данных» 1323:161308) */
export const EMPTY_LINE_COLOR: ChartSeriesColor = 'var(--stats-empty-line)';
