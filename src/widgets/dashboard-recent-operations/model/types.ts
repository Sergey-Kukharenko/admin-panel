export type OperationStatus = 'success' | 'error' | 'loading';

export interface RecentOperation {
  id: string;
  dateLabel: string;
  type: string;
  details: string;
  status: OperationStatus;
}
