import { onMounted, ref, watch } from 'vue';

import { getDatasetFileValidationError } from '../../../entities/dataset/model/fileValidation';
import type { DatasetFile } from '../../../entities/dataset/model/types';
import type { DatasetUpload } from '../../../entities/dataset/model/upload';

export type SavedFilesState = Record<string, DatasetFile[]>;

const UPLOAD_PROGRESS_STEP = 2;
const UPLOAD_PROGRESS_INTERVAL = 40;

const uploadsMap = ref<Record<string, DatasetUpload[]>>({});
const filesMap = ref<SavedFilesState>({});
const isCategoryUploading = ref<Record<string, boolean>>({});

export function useDatasetFiles() {
  onMounted(() => {
    const saved = localStorage.getItem('dataset_uploaded_files');
    if (saved) {
      try {
        filesMap.value = JSON.parse(saved);
      } catch (e) {
        console.error('Ошибка чтения файлов из хранилища', e);
      }
    }
  });

  watch(
    filesMap,
    (newMap) => {
      localStorage.setItem('dataset_uploaded_files', JSON.stringify(newMap));
    },
    { deep: true },
  );

  const addFiles = (templateId: string, newFiles: File[]) => {
    if (!uploadsMap.value[templateId]) {
      uploadsMap.value[templateId] = [];
    }

    newFiles.forEach((file) => {
      const fileId = crypto.randomUUID();
      const validationError = getDatasetFileValidationError(file);

      const newUpload: DatasetUpload = {
        id: fileId,
        progress: validationError ? null : 0,
        status: validationError ? 'error' : 'queued',
        error: validationError,
        source: file,
      };

      uploadsMap.value[templateId]?.push(newUpload);
    });

    processUploadQueue(templateId);
  };

  const processUploadQueue = (templateId: string) => {
    if (isCategoryUploading.value[templateId]) {
      return;
    }

    const currentUploads = uploadsMap.value[templateId] ?? [];
    const nextToUpload = currentUploads.find((u) => u.status === 'queued');

    if (!nextToUpload) {
      return;
    }

    isCategoryUploading.value[templateId] = true;
    startUpload(templateId, nextToUpload.id, nextToUpload.source);
  };

  const startUpload = (templateId: string, fileId: string, originalFile: File) => {
    let progress = 0;

    const interval = setInterval(() => {
      const currentUploads = uploadsMap.value[templateId] ?? [];
      const index = currentUploads.findIndex((u) => u.id === fileId);

      if (index === -1) {
        clearInterval(interval);
        isCategoryUploading.value[templateId] = false;
        processUploadQueue(templateId);
        return;
      }

      const currentUploadItem = currentUploads[index] as DatasetUpload;
      progress = Math.min(progress + UPLOAD_PROGRESS_STEP, 100);

      currentUploads[index] = {
        ...currentUploadItem,
        status: 'uploading',
        progress,
      };

      if (progress >= 100) {
        clearInterval(interval);

        const currentCategoryFiles = filesMap.value[templateId]
          ? [...filesMap.value[templateId]!]
          : [];

        currentCategoryFiles.push({
          id: fileId,
          name: originalFile.name,
          size: originalFile.size,
          uploadedAt: new Date().toISOString(),
        });

        filesMap.value = { ...filesMap.value, [templateId]: currentCategoryFiles };

        if (uploadsMap.value[templateId]) {
          uploadsMap.value[templateId] = uploadsMap.value[templateId].filter(
            (u) => u.id !== fileId,
          );
        }

        isCategoryUploading.value[templateId] = false;
        processUploadQueue(templateId);
      }
    }, UPLOAD_PROGRESS_INTERVAL);
  };

  const removeFile = (fileId: string) => {
    const updatedMap: SavedFilesState = {};
    for (const templateId in filesMap.value) {
      const currentFiles = filesMap.value[templateId];
      if (!currentFiles) continue;

      const filtered = currentFiles.filter((file) => file.id !== fileId);
      if (filtered.length > 0) {
        updatedMap[templateId] = filtered;
      }
    }
    filesMap.value = updatedMap;

    for (const templateId in uploadsMap.value) {
      const currentUploads = uploadsMap.value[templateId];
      if (!currentUploads) continue;

      uploadsMap.value[templateId] = currentUploads.filter((u) => u.id !== fileId);
    }
  };

  const clearTemplateFiles = (templateId: string) => {
    if (filesMap.value[templateId]) {
      const updatedMap = { ...filesMap.value };
      delete updatedMap[templateId];
      filesMap.value = updatedMap;
    }
    if (uploadsMap.value[templateId]) {
      const updatedUploads = { ...uploadsMap.value };
      delete updatedUploads[templateId];
      uploadsMap.value = updatedUploads;
    }
    isCategoryUploading.value[templateId] = false;
  };

  return {
    filesMap,
    uploadsMap,
    addFiles,
    removeFile,
    clearTemplateFiles,
  };
}
