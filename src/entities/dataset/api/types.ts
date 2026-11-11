import type { components, operations } from '@/shared/api';

type Schemas = components['schemas'];

/** File upload body — the frontend builds FormData from it (Body_upload_input_data_file) */
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

/** Language of the validation errors report */
export type ReportLocale = Schemas['ReportLocale'];

export type ValidationErrors = Schemas['ValidationErrorsSchema'];

/** POST /data-load/files and single-file lookups */
export type UploadedDatasetFile = Schemas['InputDataResponseSchema'];

/** File inside a dataset-type group of GET /data-load/files */
export type DatasetFileListItem = Schemas['InputDataListItemSchema'];

export type DatasetGroup = Schemas['InputDataDatasetGroupSchema'];

export type DatasetHistoryDayGroup = Schemas['InputDataGroupSchema'];

export type FetchFilesBackendResponse = Schemas['InputDataListResponseSchema'];

/**
 * Rows of succeeded uploads per day and data type — GET /dashboard/charts/data-volume. Dense
 * series: a day without uploads comes as `value: 0`. `filters.dataset_types` lists every type with
 * succeeded uploads in the period whatever the filter; the filter narrows `series` and `summary`
 */
export type DataVolumeChartResponse = Schemas['DataVolumeChartResponseSchema'];

/** `dataset_type_id__in` — comma-separated ids; absent — every type with uploads in the period */
export type DataVolumeChartFilters = NonNullable<
  operations['get_data_volume_chart']['parameters']['query']
>;
