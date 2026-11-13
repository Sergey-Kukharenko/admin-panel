import { type MLServiceRunListItem, resolveServiceDocsUrl } from '@/entities/product';

import type {
  PredictionRunRecord,
  PredictionRunResultType,
  PredictionRunStatus,
} from '../model/types';

// Statuses of a run pre-created by the inference schedule before ML platform starts it (WT-532).
// Checked before the patterns below: data_validation_failed would otherwise match "fail"
const SCHEDULED_RUN_STATUS: Record<string, PredictionRunStatus | undefined> = {
  awaiting: 'awaiting',
  data_not_uploaded: 'outdated',
  data_validation_failed: 'invalidData',
  // TODO: drop data_delayed / validation_failed once Swagger lists the final names (Yaroslav, 2026-11-13)
  data_delayed: 'outdated',
  validation_failed: 'invalidData',
  prediction_delayed: 'delayed',
};

// status — MLServiceRunStatusName на бэке: processing / completed / error (подтверждено в WT-511)
// plus the scheduled run statuses above; в OpenAPI описан строкой, поэтому сравниваем без учета регистра
function mapRunStatus(item: MLServiceRunListItem): PredictionRunStatus {
  const normalizedStatus = item.status.toLowerCase();
  const scheduledStatus = SCHEDULED_RUN_STATUS[normalizedStatus];

  if (scheduledStatus) return scheduledStatus;
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
    predictionResultId: item.prediction_result_id ?? null,
    productId: item.product_id,
    product: productName(item.product_name),
    service: serviceName(item.ml_service_name),
    startedAt: item.started_at ?? null,
    finishedAt: item.finished_at ?? null,
    recordsCount: item.total_predictions ?? null,
    status,
    resultType: resolveResultType(item, status),
    apiDocsUrl: resolveServiceDocsUrl(item.product_name, item.ml_service_name),
  };
}
