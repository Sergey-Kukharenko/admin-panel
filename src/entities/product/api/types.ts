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

/**
 * Daily results of the product's ML services for the last 30 days — GET
 * /dashboard/charts/{game-recommender | player-intelligence}. Dense series: a day without results
 * comes as `value: 0`; `has_data` false — no non-zero value in the period. 404 — the product is not
 * connected to the project.
 */
export type ProductChartResponse = Schemas['ChartResponseSchema'];

/** Products that have a dashboard chart: the slug is the path of its endpoint */
export type ProductChartSlug = Exclude<Schemas['ChartName'], 'data-volume'>;
