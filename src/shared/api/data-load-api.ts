import type {
  DatasetFilesFilters,
  DatasetTemplate,
  UploadDatasetRequest,
  UploadedDatasetFile,
} from '@/entities/dataset';

import { apiClient } from './api-client';

export const dataLoadApi = {
  /**
   * Получить список шаблонов CSV.
   */
  getTemplates() {
    return apiClient.get<DatasetTemplate[]>('/data-load/templates');
  },

  /**
   * Скачать ZIP со всеми шаблонами.
   */
  downloadTemplatesArchive() {
    return apiClient.get('/data-load/templates/archive', {
      responseType: 'blob',
    });
  },

  /**
   * Скачать шаблон по типу датасета.
   */
  downloadTemplate(datasetTypeId: string) {
    return apiClient.get(`/data-load/templates/${datasetTypeId}`, {
      responseType: 'blob',
    });
  },

  /**
   * Получить историю загрузок.
   */
  getFiles(params?: DatasetFilesFilters) {
    return apiClient.get<UploadedDatasetFile[]>('/data-load/files', {
      params,
    });
  },

  /**
   * Загрузить CSV.
   */
  uploadFile(payload: UploadDatasetRequest) {
    const formData = new FormData();

    formData.append('dataset_type_id', payload.datasetTypeId);
    formData.append('file', payload.file);

    return apiClient.post<UploadedDatasetFile>('/data-load/files', formData);
  },

  /**
   * Скачать ранее загруженный CSV.
   */
  downloadFile(fileId: string) {
    return apiClient.get(`/data-load/files/${fileId}`, {
      responseType: 'blob',
    });
  },
};
