import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

import type { DatasetFile, DatasetTemplate, DatasetUpload } from '@/entities/dataset';
import { datasetApi, getDatasetFileValidationError, mapServerTemplate } from '@/entities/dataset';
import { downloadBlob } from '@/shared/lib/downloadBlob';

const SAVED_FILES_STORAGE_KEY = 'dataset_uploaded_files';

export type SavedFilesState = Record<string, DatasetFile[]>;

function readSavedFiles(): SavedFilesState {
  const saved = localStorage.getItem(SAVED_FILES_STORAGE_KEY);
  if (!saved) return {};

  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error(e);
    return {};
  }
}

export const useUploadDatasetStore = defineStore('uploadDataset', () => {
  const templates = ref<DatasetTemplate[]>([]);
  const uploadsMap = ref<Record<string, DatasetUpload[]>>({});
  const filesMap = ref<SavedFilesState>(readSavedFiles());
  const isCategoryUploading = ref<Record<string, boolean>>({});

  let isInitialized = false;

  watch(
    filesMap,
    (value) => {
      localStorage.setItem(SAVED_FILES_STORAGE_KEY, JSON.stringify(value));
    },
    { deep: true },
  );

  async function init() {
    if (isInitialized) return;
    isInitialized = true;

    try {
      const response = await datasetApi.getTemplates();
      templates.value = response.data.map(mapServerTemplate);
    } catch (e) {
      console.error('Ошибка при загрузке шаблонов датасетов:', e);
    }
  }

  function addFiles(templateId: string, newFiles: File[]) {
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
  }

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
    } catch {
      upload.status = 'error';
      upload.progress = null;
      upload.error = 'Ошибка загрузки файла';
    }

    isCategoryUploading.value[templateId] = false;

    processQueue(templateId);
  }

  function removeFile(fileId: string) {
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
  }

  function clearTemplateFiles(templateId: string) {
    delete filesMap.value[templateId];
    delete uploadsMap.value[templateId];
    isCategoryUploading.value[templateId] = false;
  }

  function resetAll() {
    filesMap.value = {};
    uploadsMap.value = {};
  }

  async function downloadTemplateFile(templateId: string, templateName: string) {
    try {
      const response = await datasetApi.downloadTemplate(templateId);

      downloadBlob(response.data, `${templateName.toLowerCase()}_template.csv`);
    } catch (e) {
      console.error('Не удалось скачать шаблон файла:', e);
    }
  }

  return {
    templates,
    filesMap,
    uploadsMap,
    init,
    addFiles,
    removeFile,
    clearTemplateFiles,
    resetAll,
    downloadTemplateFile,
  };
});
