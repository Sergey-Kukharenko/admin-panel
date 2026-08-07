export interface PredictionFilters {
  limit?: number;
  offset?: number;
}

export interface PredictionResult {
  prediction_result_id: string;
  product_id: string;
  product_name: string;
  ml_service_id: string | null;
  ml_service_name: string | null;
  started_at: string | null;
  finished_at: string | null;
  total_predictions: number | null;
  service_run_status: string | null;
  is_downloadable: boolean;
}

export interface PredictionResultListResponse {
  items: PredictionResult[];
  total_count: number;
  next_page_offset: number | null;
}
