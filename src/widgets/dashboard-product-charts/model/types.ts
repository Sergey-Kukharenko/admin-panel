import type { AppChartGridTick } from '@/shared/ui/app-chart-grid';

/** One point of a line, in percent of the plot area */
export interface ProductChartPlotPoint {
  /** UTC day, `YYYY-MM-DD` */
  date: string;
  /** 0 — the first day, 100 — the last one */
  x: number;
  /** 0 — the axis top, 100 — the 0 line */
  y: number;
}

/** One ML service of the product, or the zero line of a chart without data */
export interface ProductChartLine {
  /** `series_key` from the API (`main`, `vip-churn`, …), `empty` for the zero line */
  seriesKey: string;
  /** Color token of the line and its markers */
  color: `var(--${string})`;
  points: ProductChartPlotPoint[];
}

/** One ML service in the legend under the chart (UI kit Legend Item 52:3438) */
export interface ProductChartLegendItem {
  seriesKey: string;
  /** Display name of the service from the product dictionary (Recommended for You, VIP Churn, …) */
  label: string;
  /** CSS color of the line, for the checkbox */
  color: `var(--${string})`;
  /** Hidden from the chart by a click in the legend */
  hidden: boolean;
}

/** What the plot draws: the axis, the dates and the lines */
export interface ProductChartView {
  /** Value axis from the top line down to 0 */
  ticks: AppChartGridTick[];
  /** The first, the middle and the last day of the period: "13 мая" (as the data chart) */
  dateLabels: string[];
  lines: ProductChartLine[];
  /** Every service of the response, hidden ones included; empty without data */
  legend: ProductChartLegendItem[];
}

/** One product chart of the block: the header is always shown, the plot once the data is loaded */
export interface ProductChartItem {
  productSlug: string;
  /** Product name from the product dictionary (Recommender System, Player Intelligence) */
  title: string;
  subtitle: string;
  isLoading: boolean;
  /** The request failed and there is no data to show */
  isError: boolean;
  /** null while loading or after an error */
  chart: ProductChartView | null;
}
