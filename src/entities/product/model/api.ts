export interface ProductService {
  ml_service_id: string;
  name: string;
  service_status: string;
  last_service_run_status: string | null;
  last_prediction_at: string | null;
  next_prediction_date: string;
}

export interface Product {
  product_id: string;
  name: string;
  services: ProductService[];
}

export interface ProductRequiredFileTypeStatus {
  dataset_type_id: string;
  name: string;
  status: string;
  input_data_id: string | null;
}

export interface ProductRequiredFilesStatus {
  product_id: string;
  is_ready: boolean;
  is_notified: boolean;
  can_notify: boolean;
  dataset_types: ProductRequiredFileTypeStatus[];
}

export interface MLServiceRunStatus {
  ml_service_run_status_id: string;
  name: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface ProductRun {
  product_run_id: string;
  project_id: string;
  product_id: string;
  product_run_external_id: string;
  aggregated_ml_service_run_status_id: string;
  aggregated_ml_service_run_status: MLServiceRunStatus | null;
  started_at: string | null;
  finished_at: string | null;
  error_status_message: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface MLServiceRun {
  ml_service_run_id: string;
  product_run_id: string;
  ml_service_id: string;
  /** Строка без enum в OpenAPI; на стенде — processing / completed / error */
  status: string;
  service_version: string | null;
  started_at: string | null;
  finished_at: string | null;
  error_status_message: string | null;
  event_occurred_at: string | null;
  product_id: string;
  product_name: string;
  ml_service_name: string;
  prediction_result_id: string | null;
  total_predictions: number | null;
  is_downloadable: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface MLServiceRunListItem {
  ml_service_run_id: string;
  /** Общий для всех сервисов одного прогона продукта (единый run_id пайплайна, WT-300) */
  product_run_id: string;
  product_id: string;
  product_name: string;
  ml_service_id: string;
  ml_service_name: string;
  status: string;
  service_version: string | null;
  started_at: string | null;
  finished_at: string | null;
  error_status_message: string | null;
  total_predictions: number | null;
  /** id результата для /predictions/{id}/download; null, пока прогон не дал результат */
  prediction_result_id: string | null;
  is_downloadable: boolean;
  created_at: string;
}

export interface MLServiceRunListResponse {
  items: MLServiceRunListItem[];
  total_count: number;
  next_page_offset: number | null;
}

export interface MLServiceRunFilters {
  /** Список product_id через запятую */
  product_id__in?: string;
  /** Поля через запятую, "-" — по убыванию; по умолчанию на бэке -created_at */
  order_by?: string;
  limit?: number;
  offset?: number;
}
