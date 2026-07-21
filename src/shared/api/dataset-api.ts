import type { UploadDatasetRequest, UploadDatasetResponse } from '@/entities/dataset';

import { apiClient } from './api-client';

export async function uploadDatasetFile({
  datasetTypeId,
  file,
  onProgress,
}: UploadDatasetRequest): Promise<UploadDatasetResponse> {
  const formData = new FormData();

  formData.append('dataset_type_id', datasetTypeId);
  formData.append('file', file);

  const { data } = await apiClient.post<UploadDatasetResponse>('/data-load/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress(event) {
      if (!event.total || !onProgress) {
        return;
      }

      onProgress(Math.round((event.loaded * 100) / event.total));
    },
  });

  return data;
}
