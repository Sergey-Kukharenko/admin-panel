import type { ChartTooltipRow } from '@/shared/lib/chart';

/**
 * One series of the hovered point in a chart tooltip (Figma chart tooltip 55:2287); the component
 * draws the square of the color itself
 */
export type AppChartTooltipRow = ChartTooltipRow;

export interface AppChartTooltipProps {
  /** The day of the point: `formatTooltipDate` */
  title: string;
  rows: readonly AppChartTooltipRow[];
}

export interface AppChartTooltipLayerProps {
  /**
   * Centers of the chart points in percent of the layer width, in the point order: the pointer picks
   * the nearest one, the tooltip and the cursor stand on it
   */
  positions: readonly number[];
  /** Points without a tooltip (a day without data): the pointer shows nothing, the arrows skip them */
  disabled?: readonly boolean[];
  /** Accessible name of the chart for the keyboard: what it shows and that the arrows move by day */
  label: string;
  /** Value text a screen reader reads for the active point (`aria-valuetext`): the date and the values */
  describe: (index: number) => string;
  /** Vertical cursor line at the active point (line charts, UI kit chart 52:3356) */
  cursor?: boolean;
}
