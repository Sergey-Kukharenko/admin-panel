import type { DatasetStatus } from './types';

// Backend различает "awaiting" (в очереди) и "processing" (уже обрабатывается) —
// в UI оба этих статуса относятся к одному состоянию LOADING
export type BackendFileStatus = 'succeeded' | 'failed' | 'awaiting' | 'processing';

const UI_TO_BACKEND_STATUS: Record<DatasetStatus, string> = {
  SUCCESS: 'succeeded',
  ERROR: 'failed',
  LOADING: 'awaiting,processing',
};

const BACKEND_TO_UI_STATUS: Record<BackendFileStatus, DatasetStatus> = {
  succeeded: 'SUCCESS',
  failed: 'ERROR',
  awaiting: 'LOADING',
  processing: 'LOADING',
};

export function mapUiStatusToBackend(status: DatasetStatus | ''): string | undefined {
  return status ? UI_TO_BACKEND_STATUS[status] : undefined;
}

export function mapBackendStatusToUi(status: string): DatasetStatus {
  return BACKEND_TO_UI_STATUS[status as BackendFileStatus] ?? 'LOADING';
}
