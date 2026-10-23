// TODO: WT-322 — replace with aliases on the generated OpenAPI types once GET
// /dashboard/charts/game-recommender and /player-intelligence are in the backend schema (contract:
// RFC Ph-1 Dashboard, 4.1, 4.3, 4.4)

/** One day of a series; days without results come as `value: 0` (dense series) */
export interface ProductChartPoint {
  /** UTC day, `YYYY-MM-DD` */
  date: string;
  value: number;
}

export interface ProductChartSeries {
  /** ML service slug: `main`, `new_for_user`, `vip-churn`, … — the frontend maps the display name */
  series_key: string;
  points: ProductChartPoint[];
}

/**
 * Daily results of the product's ML services for the last 30 days — GET
 * /dashboard/charts/{game-recommender | player-intelligence}. 404 — the product is not connected
 * to the project.
 */
export interface ProductChartResponse {
  chart_name: 'game-recommender' | 'player-intelligence';
  period: {
    start_date: string;
    end_date: string;
    granularity: 'day';
  };
  summary: {
    /** Sum of all values of all series in the period */
    total_value: number;
  };
  /** Product charts have no filters (RFC 4.1) */
  filters: null;
  series: ProductChartSeries[];
  /** false — no non-zero value in the period (the series still come, filled with 0) */
  has_data: boolean;
}
