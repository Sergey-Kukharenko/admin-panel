import { apiClient } from '@/shared/api';

import type { DatasetFilesFilters, UploadDatasetRequest, UploadedDatasetFile } from '../model/api';

export const datasetApi = {
  /** Получить список шаблонов CSV */
  getTemplates() {
    return apiClient.get<Array<{ dataset_type_id: string; name: string }>>('/data-load/templates');
  },

  /** Скачать ZIP со всеми шаблонами */
  downloadTemplatesArchive() {
    return apiClient.get<Blob>('/data-load/templates/archive', { responseType: 'blob' });
  },

  /** Скачать шаблон по типу датасета */
  downloadTemplate(datasetTypeId: string) {
    return apiClient.get<Blob>(`/data-load/templates/${datasetTypeId}`, { responseType: 'blob' });
  },

  /** Получить историю загрузок */
  getFiles(params?: DatasetFilesFilters) {
    return apiClient.get<UploadedDatasetFile[]>('/data-load/files', { params });
  },

  /** Загрузить CSV с отслеживанием прогресса */
  uploadFile(payload: UploadDatasetRequest, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('dataset_type_id', payload.datasetTypeId);
    formData.append('file', payload.file);

    return apiClient.post<UploadedDatasetFile>('/data-load/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress(event) {
        if (!event.total) return;
        const percent = Math.round((event.loaded * 100) / event.total);
        onProgress?.(percent);
      },
    });
  },

  /** Скачать ранее загруженный CSV */
  downloadFile(fileId: string) {
    return apiClient.get<Blob>(`/data-load/files/${fileId}`, { responseType: 'blob' });
  },
};
