export interface UploadDatasetRequest {
  datasetTypeId: string;
  file: File;
  onProgress?: (progress: number) => void;
}

export interface UploadDatasetResponse {
  file_id: string;
  project_id: string;
  dataset_type: string;
  rows_count: number;
  status: string;
  file_name: string;
  s3_bucket: string;
  source_type: string;
  validation_errors: DatasetValidationErrors | null;
  uploaded_at: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatasetFilesFilters {
  dataset_type_id__in?: string;
  source_type__in?: string;
  status__in?: string;
  uploaded_at__gte?: string;
  uploaded_at__lte?: string;
  order_by?: string;
  limit?: number;
  offset?: number;
}

export interface UploadedDatasetFile {
  file_id: string;
  project_id: string;
  dataset_type: string;
  rows_count: number;
  status: string;
  file_name: string;
  s3_bucket: string;
  source_type: string;
  validation_errors: DatasetValidationErrors | null;
  uploaded_at: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatasetValidationErrors {
  errors: {
    missing_columns: string[];
    missing_values: MissingValueError[];
    wrong_column_type: WrongColumnTypeError[];
    not_allowed_values: NotAllowedValuesError[];
  };
}

export interface MissingValueError {
  column: string;
  error_count: number;
  sample_rows: number[];
}

export interface WrongColumnTypeError {
  column: string;
  required: string;
  actual: string;
  error_count: number;
  sample_rows: number[];
}

export interface NotAllowedValuesError {
  column: string;
  invalid_values: InvalidValueError[];
}

export interface InvalidValueError {
  value: string;
  error_count: number;
  sample_rows: number[];
}
