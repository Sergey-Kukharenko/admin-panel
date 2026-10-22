// TODO: WT-322 — replace with aliases on the generated OpenAPI types once GET
// /dashboard/charts/data-volume is in the backend schema (contract: RFC Ph-1 Dashboard, 4.1–4.2)

/** One day of a series; days without uploads come as `value: 0` (dense series) */
export interface DataVolumeChartPoint {
  /** UTC day, `YYYY-MM-DD` */
  date: string;
  value: number;
}

export interface DataVolumeChartSeries {
  /** `dataset_types.name`, e.g. `bets` */
  series_key: string;
  points: DataVolumeChartPoint[];
}

export interface DataVolumeChartDatasetType {
  dataset_type_id: string;
  name: string;
}

/** Processed rows per day and data type — GET /dashboard/charts/data-volume */
export interface DataVolumeChartResponse {
  chart_name: 'data-volume';
  period: {
    start_date: string;
    end_date: string;
    granularity: 'day';
  };
  summary: {
    /** Sum of all values of all series in the period */
    total_value: number;
  };
  filters: {
    /** Data types for the filter: the frontend does not hardcode the list */
    dataset_types: DataVolumeChartDatasetType[];
  } | null;
  series: DataVolumeChartSeries[];
  has_data: boolean;
}

export interface DataVolumeChartFilters {
  /**
   * Selected data types; empty or absent — all types of the period. WT-322: send it the way the
   * backend filters expect (`ids.join(',')` for fastapi-filter `__in`), not as an axios array
   */
  dataset_type_id__in?: string[];
}
