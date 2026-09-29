export type PredictionRunStatus = 'ready' | 'generating' | 'failed';

export type PredictionRunResultType = 'csv' | 'api';

export interface PredictionRunRecord {
  /** ml_service_run_id — уникален для строки */
  id: string;
  /** product_run_id — общий для сервисов одного прогона продукта, колонка «ID» (WT-300) */
  runId: string;
  /** prediction_result_id для скачивания; null, пока результата нет */
  predictionResultId: string | null;
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
  /** null, если результата нет (например, при статусе 'failed' или 'generating') */
  resultType: PredictionRunResultType | null;
}

export type PredictionRunSortField =
  | 'runId'
  | 'product'
  | 'service'
  | 'startedAt'
  | 'finishedAt'
  | 'recordsCount'
  | 'status';

export type PredictionRunSortOrder = 'asc' | 'desc';
