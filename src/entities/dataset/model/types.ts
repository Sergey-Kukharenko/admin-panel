import type { DatasetUploadStatus } from './upload';

export interface DatasetHistoryKeyParams {
  types: string;
  status: string;
  period: string;
  orderBy: string;
  offset: number;
}

export type DatasetIcon = 'users' | 'vip' | 'bets' | 'balance' | 'payments';

export interface DatasetFile {
  id: string;
  file: File;
  name: string;
  size: number;
  uploadedAt: string;
  progress: number;
  status: DatasetUploadStatus;
  serverFileId?: string;
  rowsCount?: number;
  error?: string;
}

export interface DatasetTemplate {
  id: string;
  title: string;
  description: string;
  icon: DatasetIcon;
  count?: number;
  files?: DatasetFile[];
}
