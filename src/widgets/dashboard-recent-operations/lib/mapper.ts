import type {
  RecentOperationItem,
  RecentOperationListResponse,
  RecentOperationStatus,
} from '@/entities/operation';
import { formatDateTime } from '@/shared/lib/formatDateTime';
import type { AppStatusBadgeStatus } from '@/shared/ui/app-status-badge';

import { OPERATION_TYPE_LABEL_KEYS, OTHER_OPERATION_LABEL_KEY } from '../config/operationTypes';
import type { RecentOperationRow, RecentOperationsView } from '../model/types';

interface MapOptions {
  intlLocale: string;
  /** Translates an i18n key (the operation type labels of config/operationTypes) */
  translate: (key: string) => string;
  /** Display name of an ML service by its slug (`useProductDisplayNames().serviceName`) */
  serviceName: (slug: string) => string;
  /** "145 000 строк": the formatted count in the plural form of the count */
  rowsLabel: (count: number, formatted: string) => string;
}

// Status badge per operation status (Jira WT-327: success / error / in progress); an unknown status
// from the backend is shown neutral instead of breaking the row
const STATUS_BADGES: Record<RecentOperationStatus, AppStatusBadgeStatus> = {
  succeeded: 'success',
  failed: 'error',
  processing: 'loading',
};

// A model run in progress is computing, not loading: the UI kit «Обработка» (Processing) badge
// instead of «Загрузка» (asked in WT-327)
function toStatus(item: RecentOperationItem): AppStatusBadgeStatus {
  if (item.status === 'processing' && item.type === 'ml_service_run') return 'neutral';
  return STATUS_BADGES[item.status] ?? 'neutral';
}

const DETAILS_SEPARATOR = ' · ';

function toDetails(item: RecentOperationItem, options: MapOptions): string {
  const rows =
    item.rows_count === null
      ? null
      : options.rowsLabel(item.rows_count, item.rows_count.toLocaleString(options.intlLocale));
  // Data type names stay as in the API (they match Swagger), the format is upper-cased as in the
  // mockup: "bets · CSV · 145,000 строк" (Figma 1574:181319)
  const parts =
    item.type === 'ml_service_run'
      ? [item.service_slug && options.serviceName(item.service_slug), rows]
      : [item.dataset_type, item.file_format?.toUpperCase(), rows];
  const shown = parts.filter((part): part is string => Boolean(part));

  return shown.length > 0 ? shown.join(DETAILS_SEPARATOR) : '-';
}

/** One operation of the API → a table row */
export function mapRecentOperationToRow(
  item: RecentOperationItem,
  options: MapOptions,
): RecentOperationRow {
  return {
    id: item.id,
    dateLabel: formatDateTime(item.created_at, options.intlLocale),
    typeLabel: options.translate(OPERATION_TYPE_LABEL_KEYS[item.type] ?? OTHER_OPERATION_LABEL_KEY),
    details: toDetails(item, options),
    status: toStatus(item),
  };
}

/** The operations response → the rows in the API order (newest first) and the total counter */
export function mapRecentOperationsToView(
  response: RecentOperationListResponse,
  options: MapOptions,
): RecentOperationsView {
  return {
    rows: response.items.map((item) => mapRecentOperationToRow(item, options)),
    totalCount: response.total_count,
  };
}
