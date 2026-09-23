import type { PredictionResult } from '@/entities/prediction';

import type { PredictionRunRecord, PredictionRunResultType, PredictionRunStatus } from './types';

// service_run_status не задокументирован backend'ом как enum (в OpenAPI-схеме это
// произвольная строка); по RFC инференса значения — PROCESSING / COMPLETED / ERROR.
// is_downloadable используем как основной сигнал готовности результата
function mapRunStatus(item: PredictionResult): PredictionRunStatus {
  if (item.is_downloadable) return 'ready';

  const normalizedStatus = item.service_run_status?.toLowerCase() ?? '';

  if (/fail|error/.test(normalizedStatus)) return 'failed';
  if (/process|progress|run|generat|pending/.test(normalizedStatus)) return 'generating';

  return 'ready';
}

// Бэкенд не отдает тип результата отдельным полем, поэтому продукты секции рекомендаций
// (доступ только через REST API, без файла) распознаем по названию продукта — та же
// эвристика, что и в predictions-manager/model/mapper.ts для выбора иконки продукта
function resolveResultType(
  item: PredictionResult,
  status: PredictionRunStatus,
): PredictionRunResultType | null {
  if (!item.is_downloadable || status !== 'ready') return null;

  const normalized = item.product_name.toLowerCase();

  return /recommend|game/.test(normalized) ? 'api' : 'csv';
}

export function mapPredictionResultToRunRecord(item: PredictionResult): PredictionRunRecord {
  const status = mapRunStatus(item);

  return {
    id: item.prediction_result_id,
    productId: item.product_id,
    product: item.product_name,
    service: item.ml_service_name ?? '-',
    startedAt: item.started_at,
    finishedAt: item.finished_at,
    recordsCount: item.total_predictions,
    status,
    resultType: resolveResultType(item, status),
  };
}
