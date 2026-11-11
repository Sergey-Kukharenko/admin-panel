import type { DataVolumeChartFilters } from '../api/types';
import type { DatasetHistoryKeyParams } from './types';

// The keys live in the entity, not in the widgets: features/upload-dataset invalidates the upload
// history without importing a widget (FSD import direction)
export const datasetKeys = {
  all: ['datasets'] as const,
  /** Prefix of every upload history page: invalidated after an upload */
  histories: () => [...datasetKeys.all, 'history'] as const,
  /** GET /data-load/files: one page of the upload history table with its filter state */
  history: (params: Readonly<DatasetHistoryKeyParams>) =>
    [...datasetKeys.histories(), params] as const,
  /** GET /dashboard/charts/data-volume */
  dataVolumeChart: (filters: DataVolumeChartFilters) =>
    [...datasetKeys.all, 'data-volume-chart', filters] as const,
};
