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
  status_id: string;
  status: MLServiceRunStatus | null;
  service_version: string | null;
  started_at: string | null;
  finished_at: string | null;
  error_status_message: string | null;
  event_occurred_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string | null;
}
