export interface UploadDatasetRequest {
  datasetTypeId: string;
  file: File;
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

/** Optional rich detail for a column-level issue (sample rows / counts) — ColumnIssueDetailSchema */
export interface ColumnIssueDetail {
  error_count?: number | null;
  sample_rows?: number[];
}

/** One disallowed value with optional ML diagnostics — NotAllowedValueDetailSchema */
export interface NotAllowedValueDetail {
  value: string;
  error_count?: number | null;
  sample_rows?: number[];
}

/** Type mismatch for one column (ML platform shape) — WrongColumnTypeDetailSchema */
export interface WrongColumnTypeDetail {
  required: string | string[];
  actual?: string | null;
}

export interface ValidationErrors {
  /** ML or portal: required CSV columns absent from upload. */
  missing_required_columns?: string[];
  /** ML: columns with null values in required fields (flat column names). */
  missing_values?: string[];
  /** ML: per-column error_count and sample_rows for missing_values. */
  missing_values_details?: Record<string, ColumnIssueDetail>;
  /** ML: expected vs actual dtype per column. */
  wrong_column_type?: Record<string, WrongColumnTypeDetail>;
  /** ML: disallowed enum/value per column (flat value lists). */
  not_allowed_values?: Record<string, string[]>;
  /** ML: per-value error_count and sample_rows for not_allowed_values. */
  not_allowed_values_details?: Record<string, NotAllowedValueDetail[]>;
  /** Portal prevalidation: CSV columns not in the dataset template. */
  extra_columns?: string[];
  /** Portal prevalidation: malformed CSV header row. */
  header_errors?: string[];
}

/** POST /data-load/files response and single-file lookups — InputDataResponseSchema */
export interface UploadedDatasetFile {
  file_id: string;
  project_id: string;
  dataset_type: string;
  rows_count: number;
  status: 'succeeded' | 'failed' | 'awaiting' | 'processing';
  file_name: string;
  s3_bucket: string;
  source_type: string | null;
  validation_errors: ValidationErrors | null;
  uploaded_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string | null;
}

/** Item inside a dataset-type group of GET /data-load/files — InputDataListItemSchema */
export interface DatasetFileListItem {
  file_id: string;
  file_name: string;
  file_name_csv: string;
  source_type: string;
  rows_count: number;
  status: 'succeeded' | 'failed' | 'awaiting' | 'processing';
  validation_errors?: ValidationErrors | null;
}

export interface DatasetGroup {
  dataset_type: string;
  files_count: number;
  files: DatasetFileListItem[];
}

export interface DatasetHistoryDayGroup {
  uploaded_at: string;
  dataset_groups: DatasetGroup[];
}

export interface FetchFilesBackendResponse {
  items: DatasetHistoryDayGroup[];
  total_count: number;
  next_page_offset: number | null;
}
