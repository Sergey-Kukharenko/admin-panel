export type PredictionRunStatus = 'ready' | 'failed';

export interface PredictionRunRecord {
  id: string;
  productId: string;
  product: string;
  service: string;
  /** ISO-дата начала расчета, null — если прогон еще не стартовал */
  startedAt: string | null;
  /** ISO-дата завершения расчета — null, если прогон завершился ошибкой и не досчитался */
  finishedAt: string | null;
  /** null, если прогон завершился ошибкой и записей нет */
  recordsCount: number | null;
  status: PredictionRunStatus;
  isDownloadable: boolean;
}

export type PredictionRunSortField =
  | 'id'
  | 'product'
  | 'service'
  | 'startedAt'
  | 'finishedAt'
  | 'recordsCount'
  | 'status';

export type PredictionRunSortOrder = 'asc' | 'desc';
