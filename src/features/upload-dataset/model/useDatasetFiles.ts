import { onMounted, ref, watch } from 'vue';

import {
  datasetApi,
  type DatasetFile,
  type DatasetTemplate,
  type DatasetUpload,
  getDatasetFileValidationError,
  mapServerTemplate, // Импортируем наш маппер
} from '@/entities/dataset';

export type SavedFilesState = Record<string, DatasetFile[]>;

// ИСПРАВЛЕНО: Теперь шаблоны — это динамический реактивный массив вместо статичных моков
const templates = ref<DatasetTemplate[]>([]);
const uploadsMap = ref<Record<string, DatasetUpload[]>>({});
const filesMap = ref<SavedFilesState>({});
const isCategoryUploading = ref<Record<string, boolean>>({});

export function useDatasetFiles() {
  // Новый метод для загрузки и трансформации шаблонов
  const loadTemplates = async () => {
    try {
      const response = await datasetApi.getTemplates();
      templates.value = response.data.map(mapServerTemplate);
    } catch (e) {
      console.error('Ошибка при загрузке шаблонов датасетов:', e);
    }
  };

  onMounted(() => {
    loadTemplates(); // Запускаем загрузку данных с бэкенда при открытии/монтировании

    const saved = localStorage.getItem('dataset_uploaded_files');
    if (!saved) return;

    try {
      filesMap.value = JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  });

  watch(
    filesMap,
    (value) => {
      localStorage.setItem('dataset_uploaded_files', JSON.stringify(value));
    },
    { deep: true },
  );

  const addFiles = (templateId: string, newFiles: File[]) => {
    if (!uploadsMap.value[templateId]) {
      uploadsMap.value[templateId] = [];
    }

    const currentUploads = uploadsMap.value[templateId];
    if (!currentUploads) return;

    newFiles.forEach((file) => {
      const validationError = getDatasetFileValidationError(file);

      currentUploads.push({
        id: crypto.randomUUID(),
        source: file,
        progress: validationError ? null : 0,
        status: validationError ? 'error' : 'queued',
        error: validationError,
      });
    });

    processQueue(templateId);
  };

  async function processQueue(templateId: string) {
    if (isCategoryUploading.value[templateId]) {
      return;
    }

    const upload = uploadsMap.value[templateId]?.find((item) => item.status === 'queued');

    if (!upload) {
      return;
    }

    isCategoryUploading.value[templateId] = true;

    upload.status = 'uploading';

    try {
      const response = await datasetApi.uploadFile(
        {
          datasetTypeId: templateId,
          file: upload.source,
        },
        (progress) => {
          upload.progress = progress;
        },
      );

      const responseData = response.data;

      if (!filesMap.value[templateId]) {
        filesMap.value[templateId] = [];
      }

      filesMap.value[templateId]?.push({
        id: upload.id,
        file: upload.source,
        // ИСПРАВЛЕНО: Берем красивое имя исходного файла пользователя
        name: upload.source.name,
        size: upload.source.size,
        uploadedAt: responseData.uploaded_at,
        progress: 100,
        status: 'success',
        serverFileId: responseData.file_id,
        rowsCount: responseData.rows_count,
      });

      uploadsMap.value[templateId] = (uploadsMap.value[templateId] || []).filter(
        (item) => item.id !== upload.id,
      );
    } catch (e) {
      upload.status = 'error';
      upload.progress = null;
      upload.error = 'Ошибка загрузки файла';
    }

    isCategoryUploading.value[templateId] = false;

    processQueue(templateId);
  }

  const removeFile = (fileId: string) => {
    for (const templateId in filesMap.value) {
      filesMap.value[templateId] = (filesMap.value[templateId] || []).filter(
        (file) => file.id !== fileId,
      );
    }

    for (const templateId in uploadsMap.value) {
      uploadsMap.value[templateId] = (uploadsMap.value[templateId] || []).filter(
        (upload) => upload.id !== fileId,
      );
    }
  };

  const clearTemplateFiles = (templateId: string) => {
    delete filesMap.value[templateId];
    delete uploadsMap.value[templateId];
    isCategoryUploading.value[templateId] = false;
  };

  /**
   * Скачать пустой эталонный CSV-шаблон с бэкенда по его ID
   */
  const downloadTemplateFile = async (templateId: string, templateName: string) => {
    try {
      const response = await datasetApi.downloadTemplate(templateId);

      // Создаем временную ссылку на Blob (бинарный CSV-файл)
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;

      // Название файла при скачивании, например: users_template.csv
      link.setAttribute('download', `${templateName.toLowerCase()}_template.csv`);

      document.body.appendChild(link);
      link.click();

      // Очищаем DOM и память
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Не удалось скачать шаблон файла:', e);
    }
  };

  return {
    templates, // Обязательно возвращаем наружу для UI-компонентов
    filesMap,
    uploadsMap,
    addFiles,
    removeFile,
    clearTemplateFiles,
    downloadTemplateFile,
  };
}
