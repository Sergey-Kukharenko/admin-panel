export type DatasetStatus = 'LOADING' | 'SUCCESS' | 'ERROR';
export type DatasetPeriod = 'today' | 'week' | 'month';
export type DatasetSort = 'rows' | null;
export type DatasetSortOrder = 'asc' | 'desc';

export type DatasetFileStatus = 'uploaded' | 'processing' | 'error';

export interface DatasetHistoryFile {
  id: string;
  name: string;
  rowsCount: number;
  status: DatasetFileStatus;
}

export interface DatasetHistoryCategory {
  id: string;
  title: string;
  count: number;
  files: DatasetHistoryFile[];
}

export interface DatasetHistoryGroup {
  id: string;
  date: string;
  uploadedCount: number;
  totalCount: number;
  source: string;
  categories: DatasetHistoryCategory[];
}
