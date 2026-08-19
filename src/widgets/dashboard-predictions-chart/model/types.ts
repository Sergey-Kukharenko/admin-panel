export interface PredictionPoint {
  month: string;
  label: string;
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
}
