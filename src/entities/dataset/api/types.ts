import type { components, operations } from '@/shared/api';

type Schemas = components['schemas'];

/** Тело загрузки файла — собирается на фронте в FormData (Body_upload_input_data_file) */
export interface UploadDatasetRequest {
  datasetTypeId: string;
  file: File;
}

export type DatasetTemplateResponse = Schemas['DatasetTemplateResponseSchema'];

export type DatasetFilesFilters = NonNullable<
  operations['list_input_data_files']['parameters']['query']
>;

export type ColumnIssueDetail = Schemas['ColumnIssueDetailSchema'];

export type NotAllowedValueDetail = Schemas['NotAllowedValueDetailSchema'];

export type WrongColumnTypeDetail = Schemas['WrongColumnTypeDetailSchema'];

/** Язык отчёта об ошибках валидации */
export type ReportLocale = Schemas['ReportLocale'];

export type ValidationErrors = Schemas['ValidationErrorsSchema'];

/** POST /data-load/files и запросы одного файла */
export type UploadedDatasetFile = Schemas['InputDataResponseSchema'];

/** Файл внутри группы по типу датасета в GET /data-load/files */
export type DatasetFileListItem = Schemas['InputDataListItemSchema'];

export type DatasetGroup = Schemas['InputDataDatasetGroupSchema'];

export type DatasetHistoryDayGroup = Schemas['InputDataGroupSchema'];

export type FetchFilesBackendResponse = Schemas['InputDataListResponseSchema'];
