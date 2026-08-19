export interface PredictionPoint {
  month: string;
  value: number;
}

export interface PredictionSeries {
  productId: string;
  productName: string;
  colorVar: string;
  points: PredictionPoint[];
}

export interface PredictionsChartDataset {
  totalRowsByProduct: Record<string, number>;
  series: PredictionSeries[];
  xAxisLabels: [string, string];
}
