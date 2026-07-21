export type DatasetUploadStatus = 'queued' | 'uploading' | 'processing' | 'success' | 'error';

export interface DatasetUpload {
  id: string;
  source: File;
  status: DatasetUploadStatus;
  progress: number | null;
  error?: string;
}
