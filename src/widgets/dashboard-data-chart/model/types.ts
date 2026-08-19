export type ChartSeriesKey =
  | 'bets'
  | 'users'
  | 'betsDaily'
  | 'balanceDaily'
  | 'payments'
  | 'vipUsers';

export interface ChartSeriesDef {
  key: ChartSeriesKey;
  label: string;
  colorVar: string;
}

export interface DataChartBar {
  id: string;
  tooltipLabel: string;
  values: Partial<Record<ChartSeriesKey, number>> | null;
}

export interface DataChartDataset {
  totalRows: number;
  bars: DataChartBar[];
  xAxisLabels: [string, string, string];
}
