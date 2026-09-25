import type { PredictionResult } from '@/entities/prediction';
import { resolveProductIconName } from '@/entities/product';

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
// (доступ только через REST API, без файла) распознаем по системному имени продукта — та же
// эвристика, что и для выбора иконки продукта в карточках
function resolveResultType(
  item: PredictionResult,
  status: PredictionRunStatus,
): PredictionRunResultType | null {
  if (!item.is_downloadable || status !== 'ready') return null;

  return resolveProductIconName(item.product_name) === 'game-recommendations' ? 'api' : 'csv';
}

export interface RunRecordNameResolvers {
  productName: (slug: string) => string;
  serviceName: (slug: string) => string;
}

export function mapPredictionResultToRunRecord(
  item: PredictionResult,
  { productName, serviceName }: RunRecordNameResolvers,
): PredictionRunRecord {
  const status = mapRunStatus(item);

  return {
    id: item.prediction_result_id,
    productId: item.product_id,
    product: productName(item.product_name),
    service: item.ml_service_name ? serviceName(item.ml_service_name) : '-',
    startedAt: item.started_at,
    finishedAt: item.finished_at,
    recordsCount: item.total_predictions,
    status,
    resultType: resolveResultType(item, status),
  };
}
