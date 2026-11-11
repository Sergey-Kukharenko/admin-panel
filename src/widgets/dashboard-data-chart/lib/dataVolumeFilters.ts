import type { DataVolumeChartFilters } from '@/entities/dataset';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Request filters for the data type id from the URL. An id that is not a UUID (an edited link) is
 * not sent: the backend answers it with 422, and the chart would show the error state instead of
 * all types. Without the filter the response still brings the type list, so the widget can drop
 * the id from the URL.
 */
export function toDataVolumeFilters(dataTypeId: string): DataVolumeChartFilters {
  return UUID_PATTERN.test(dataTypeId) ? { dataset_type_id__in: dataTypeId } : {};
}
