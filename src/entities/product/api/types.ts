import type { components, operations } from '@/shared/api';

type Schemas = components['schemas'];

/**
 * Product service. Statuses are strings without an enum in OpenAPI; on the stand:
 * - service_status — training status: awaiting / training / active / error;
 * - last_service_run_status — last inference: processing / completed / error, null — no runs yet.
 */
export type ProductService = Schemas['ProjectProductServiceItemSchema'];

/**
 * Project product. product_status — aggregated training status (awaiting / training / active /
 * error), computed by the backend with the service error cascade (WT-299); not shown in the UI yet.
 * last_product_run_status — aggregated status of the latest product run
 */
export type Product = Schemas['ProjectProductListItemSchema'];

export type ProductRequiredFileTypeStatus = Schemas['ProductRequiredFileTypeStatusSchema'];

export type ProductRequiredFilesStatus = Schemas['ProductRequiredFilesStatusSchema'];

export type MLServiceRunStatus = Schemas['MLServiceRunStatusResponseSchema'];

export type ProductRun = Schemas['ProductRunResponseSchema'];

/** ML service run; status is a string without an enum in OpenAPI, on the stand processing / completed / error */
export type MLServiceRun = Schemas['MLServiceRunResponseSchema'];

/**
 * Run list item. product_run_id is shared by all services of one product run (single pipeline
 * run_id, WT-300); prediction_result_id — id for /predictions/{id}/download, null until the run
 * produced a result
 */
export type MLServiceRunListItem = Schemas['MLServiceRunListItemSchema'];

export type MLServiceRunListResponse = Schemas['MLServiceRunListResponseSchema'];

/** *__in — comma-separated lists; order_by — comma-separated fields, "-" for descending */
export type MLServiceRunFilters = NonNullable<
  operations['list_ml_service_runs']['parameters']['query']
>;

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
