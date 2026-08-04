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

export interface UploadedDatasetFile {
  file_id: string;
  project_id: string;
  dataset_type: string;
  rows_count: number;
  status: 'succeeded' | 'failed' | 'awaiting';
  file_name: string;
  file_name_csv: string;
  s3_bucket: string;
  source_type: string;
  validation_errors: {
    missing_columns?: string[];
    missing_values?: string[];
    wrong_column_type?: Record<string, { required: string; actual: string }>;
    not_allowed_values?: Record<string, string[]>;
  } | null;
  uploaded_at: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatasetGroup {
  dataset_type: string;
  files_count: number;
  files: UploadedDatasetFile[];
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
