import type { MLServiceRunListItem } from '@/entities/product';

import type { PredictionRunRecord, PredictionRunResultType, PredictionRunStatus } from './types';

// status — MLServiceRunStatusName на бэке: processing / completed / error (подтверждено в WT-511);
// в OpenAPI пока описан строкой, поэтому сравниваем без учета регистра
function mapRunStatus(item: MLServiceRunListItem): PredictionRunStatus {
  const normalizedStatus = item.status.toLowerCase();

  if (/fail|error/.test(normalizedStatus)) return 'failed';
  if (/process|progress|run|generat|pending/.test(normalizedStatus)) return 'generating';

  return 'ready';
}

// Способ получения результата определяется флагом is_downloadable (договоренность с бэком, WT-511):
// у завершенного прогона true — файл CSV, false — результат забирается через REST API
function resolveResultType(
  item: MLServiceRunListItem,
  status: PredictionRunStatus,
): PredictionRunResultType | null {
  if (status !== 'ready') return null;

  return item.is_downloadable && item.prediction_result_id ? 'csv' : 'api';
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
