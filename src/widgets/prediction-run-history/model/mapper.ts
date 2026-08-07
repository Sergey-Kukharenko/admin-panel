import type { PredictionResult } from '@/entities/prediction';

import type { PredictionRunRecord, PredictionRunStatus } from './types';

// service_run_status не задокументирован backend'ом как enum (в OpenAPI-схеме это
// произвольная строка), поэтому явный провал распознаём по подстроке, а is_downloadable
// используем как основной сигнал готовности результата
function mapRunStatus(item: PredictionResult): PredictionRunStatus {
  if (item.is_downloadable) return 'ready';

  const normalizedStatus = item.service_run_status?.toLowerCase() ?? '';
  return /fail|error/.test(normalizedStatus) ? 'failed' : 'ready';
}

export function mapPredictionResultToRunRecord(item: PredictionResult): PredictionRunRecord {
  return {
    id: item.prediction_result_id,
    productId: item.product_id,
    product: item.product_name,
    service: item.ml_service_name ?? '-',
    startedAt: item.started_at,
    finishedAt: item.finished_at,
    recordsCount: item.total_predictions,
    status: mapRunStatus(item),
    isDownloadable: item.is_downloadable,
  };
}
