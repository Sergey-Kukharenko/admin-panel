import type { ChartSeriesColor } from '@/shared/lib/chart';

export interface TooltipSwatch {
  /** A translucent color lies over a white fill, so the square stays light on the dark card */
  underlay: boolean;
  /** A dark color gets a 20% white inside stroke, so the square stays visible on the dark card */
  outlined: boolean;
}

// How each series square is drawn on the dark card, as in the mockup (Figma chart tooltip 55:2287):
// a property of the color, so the record lists every chart color and a new one fails the type check
// until its square is decided
const SWATCHES: Record<ChartSeriesColor, TooltipSwatch> = {
  'var(--stats-bets)': { underlay: false, outlined: false },
  'var(--stats-users)': { underlay: false, outlined: false },
  'var(--stats-bets-daily)': { underlay: false, outlined: false },
  'var(--stats-balance-daily)': { underlay: true, outlined: false },
  'var(--stats-payments)': { underlay: true, outlined: false },
  'var(--stats-vip-users)': { underlay: false, outlined: true },
  'var(--stats-neutral)': { underlay: false, outlined: false },
  'var(--stats-empty-line)': { underlay: false, outlined: false },
};

/** The square style of a series color in the chart tooltip */
export function tooltipSwatch(color: ChartSeriesColor): TooltipSwatch {
  return SWATCHES[color];
}
