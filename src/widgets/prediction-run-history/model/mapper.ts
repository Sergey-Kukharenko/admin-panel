import { type MLServiceRunListItem, resolveProductIconName } from '@/entities/product';

import type { PredictionRunRecord, PredictionRunResultType, PredictionRunStatus } from './types';

// status не задокументирован backend'ом как enum (в OpenAPI-схеме это произвольная строка);
// на стенде и по RFC инференса значения — processing / completed / error
function mapRunStatus(item: MLServiceRunListItem): PredictionRunStatus {
  const normalizedStatus = item.status.toLowerCase();

  if (/fail|error/.test(normalizedStatus)) return 'failed';
  if (/process|progress|run|generat|pending/.test(normalizedStatus)) return 'generating';

  return 'ready';
}

// Бэкенд не отдает тип результата отдельным полем, поэтому продукты секции рекомендаций
// (доступ только через REST API, без файла) распознаем по системному имени продукта — та же
// эвристика, что и для выбора иконки продукта в карточках
function resolveResultType(
  item: MLServiceRunListItem,
  status: PredictionRunStatus,
): PredictionRunResultType | null {
  if (status !== 'ready' || !item.is_downloadable || !item.prediction_result_id) return null;

  return resolveProductIconName(item.product_name) === 'game-recommendations' ? 'api' : 'csv';
}

export interface RunRecordNameResolvers {
  productName: (slug: string) => string;
  serviceName: (slug: string) => string;
}

export function mapServiceRunToRunRecord(
  item: MLServiceRunListItem,
  { productName, serviceName }: RunRecordNameResolvers,
): PredictionRunRecord {
  const status = mapRunStatus(item);

  return {
    id: item.ml_service_run_id,
    runId: item.product_run_id,
    predictionResultId: item.prediction_result_id,
    productId: item.product_id,
    product: productName(item.product_name),
    service: serviceName(item.ml_service_name),
    startedAt: item.started_at,
    finishedAt: item.finished_at,
    recordsCount: item.total_predictions,
    status,
    resultType: resolveResultType(item, status),
  };
}
