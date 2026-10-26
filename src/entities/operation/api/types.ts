// TODO: WT-334 — there is no endpoint for the recent operations yet: not in the Ph-1 dashboard RFC
// (735150238) nor in the backend (asked in WT-327). The DTO is written by hand after the H2 mockup
// (Figma 1574:181319) and the backend lists it would be built from (GET /data-load/files,
// GET /ml-service-runs); replace with the generated OpenAPI type once the endpoint exists.

/** What happened: a data file upload or a run of an ML service */
export type RecentOperationType = 'data_load' | 'ml_service_run';

/** Status of the operation, normalized from the upload (`succeeded / failed / processing`) and run
 * (`completed / error / processing`) statuses */
export type RecentOperationStatus = 'succeeded' | 'failed' | 'processing';

export interface RecentOperationItem {
  id: string;
  type: RecentOperationType;
  status: RecentOperationStatus;
  /** UTC timestamp, ISO 8601 */
  created_at: string;
  /** Data type of an upload (`bets`, `users`, …); null for a run */
  dataset_type: string | null;
  /** File format of an upload (`csv`); null for a run */
  file_format: string | null;
  /** ML service of a run (`vip-churn`, `main`, …); null for an upload */
  service_slug: string | null;
  /** Rows uploaded or processed; null when unknown (a failed upload) */
  rows_count: number | null;
}

/** The latest operations of the project, newest first */
export interface RecentOperationListResponse {
  items: RecentOperationItem[];
  /** All operations of the project, the counter of the block header */
  total_count: number;
}
