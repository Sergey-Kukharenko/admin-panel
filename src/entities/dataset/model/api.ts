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
  status: string;
  file_name: string;
  s3_bucket: string;
  source_type: string;
  validation_errors: unknown;
  uploaded_at: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// 🚀 ПЕРЕНЕСЕНО СЮДА: Описываем структуру группы внутри суток
export interface DatasetGroup {
  dataset_type: string;
  files_count: number;
  files: UploadedDatasetFile[]; // Используем тип файла, объявленный выше
}

// 🚀 ПЕРЕНЕСЕНО СЮДА: Структура суток загрузки
export interface DatasetHistoryDayGroup {
  uploaded_at: string;
  dataset_groups: DatasetGroup[];
}

// 🚀 ПЕРЕНЕСЕНО СЮДА: Финальная корневая схема ответа GET /data-load/files
export interface FetchFilesBackendResponse {
  items: DatasetHistoryDayGroup[];
  total_count: number;
  next_page_offset: number | null;
}
