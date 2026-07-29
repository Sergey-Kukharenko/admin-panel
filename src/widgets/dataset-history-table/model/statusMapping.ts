import type { DatasetStatus } from './types';

export type BackendFileStatus = 'succeeded' | 'failed' | 'awaiting';

const UI_TO_BACKEND_STATUS: Record<DatasetStatus, BackendFileStatus> = {
  SUCCESS: 'succeeded',
  ERROR: 'failed',
  LOADING: 'awaiting',
};

const BACKEND_TO_UI_STATUS: Record<BackendFileStatus, DatasetStatus> = {
  succeeded: 'SUCCESS',
  failed: 'ERROR',
  awaiting: 'LOADING',
};

export function mapUiStatusToBackend(status: DatasetStatus | ''): BackendFileStatus | undefined {
  return status ? UI_TO_BACKEND_STATUS[status] : undefined;
}

export function mapBackendStatusToUi(status: string): DatasetStatus {
  return BACKEND_TO_UI_STATUS[status as BackendFileStatus] ?? 'LOADING';
}
