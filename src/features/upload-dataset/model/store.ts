import { useQueryClient } from '@tanstack/vue-query';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';

import type { DatasetFile, DatasetTemplate, DatasetUpload } from '@/entities/dataset';
import {
  DATASET_FILE_ERRORS,
  DATASET_HISTORY_QUERY_KEY,
  DATASET_MAX_TOTAL_SIZE_BYTES,
  datasetApi,
  filterVisibleDatasetTemplates,
  getDatasetFileValidationError,
  getDatasetTypeContent,
} from '@/entities/dataset';
import { downloadBlob } from '@/shared/lib/downloadBlob';

const SAVED_FILES_STORAGE_KEY = 'dataset_uploaded_files';
// Ограничивает число одновременных запросов загрузки файлов (по всем категориям сразу),
// чтобы при загрузке нескольких тяжёлых файлов не перегружать сеть и бэк параллельными запросами
const MAX_CONCURRENT_UPLOADS = 1;

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
  const queryClient = useQueryClient();
  const { t } = useI18n({ useScope: 'global' });

  // Храним сырой ответ бэкенда (id + системное имя), а не готовый title/description —
  // они переводятся при чтении через getDatasetTypeContent, чтобы корректно
  // реагировать на смену языка интерфейса, даже если шторка уже была открыта раньше
  const rawTemplates = ref<Array<{ dataset_type_id: string; name: string }>>([]);

  const templates = computed<DatasetTemplate[]>(() =>
    rawTemplates.value.map((item) => {
      const { title, description, icon } = getDatasetTypeContent(item.name);

      return {
        id: item.dataset_type_id,
        title,
        description,
        icon,
        count: 0,
      };
    }),
  );

  const uploadsMap = ref<Record<string, DatasetUpload[]>>({});
  const filesMap = ref<SavedFilesState>(readSavedFiles());
  const isCategoryUploading = ref<Record<string, boolean>>({});
  const isSubmitting = ref(false);

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
      rawTemplates.value = filterVisibleDatasetTemplates(response.data);
    } catch (e) {
      console.error('Ошибка при загрузке шаблонов датасетов:', e);
    }
  }

  /** Суммарный объём файлов, уже занимающих квоту клиента: загруженные + ожидающие/грузящиеся */
  function getReservedTotalSize(): number {
    let total = 0;

    for (const files of Object.values(filesMap.value)) {
      total += (files ?? []).reduce((sum, file) => sum + file.size, 0);
    }

    for (const uploads of Object.values(uploadsMap.value)) {
      total += (uploads ?? [])
        .filter((upload) => upload.status !== 'error')
        .reduce((sum, upload) => sum + upload.source.size, 0);
    }

    return total;
  }

  function addFiles(templateId: string, newFiles: File[]) {
    if (!uploadsMap.value[templateId]) {
      uploadsMap.value[templateId] = [];
    }

    const currentUploads = uploadsMap.value[templateId];
    if (!currentUploads) return;

    // Общий лимит на клиента (см. DATASET_MAX_TOTAL_SIZE_BYTES) — CSV-загрузка через
    // портал рассчитана на демо/POC, для больших объёмов клиент должен использовать интеграции
    let runningTotal = getReservedTotalSize();

    newFiles.forEach((file) => {
      let validationError = getDatasetFileValidationError(file);

      if (!validationError) {
        if (runningTotal + file.size > DATASET_MAX_TOTAL_SIZE_BYTES) {
          validationError = DATASET_FILE_ERRORS.totalSizeExceeded;
        } else {
          runningTotal += file.size;
        }
      }

      // Добавление файла — чисто локальная операция, ничего не читается и не
      // грузится: реальная отправка на бэк стартует только из submitQueuedFiles.
      currentUploads.push({
        id: crypto.randomUUID(),
        source: file,
        progress: validationError ? null : 0,
        status: validationError ? 'error' : 'queued',
        error: validationError,
      });
    });
  }

  /** Ищет первый файл в очереди среди всех категорий (в порядке их добавления) */
  function findNextQueuedUpload(): { templateId: string; upload: DatasetUpload } | null {
    for (const templateId of Object.keys(uploadsMap.value)) {
      const upload = uploadsMap.value[templateId]?.find((item) => item.status === 'queued');
      if (upload) {
        return { templateId, upload };
      }
    }

    return null;
  }

  /**
   * Воркер разбирает общую очередь файлов по одному, независимо от категории —
   * несколько воркеров, запущенных параллельно (см. submitQueuedFiles), дают
   * ограниченную конкурентность загрузки на весь набор файлов, а не на категорию.
   */
  async function runUploadWorker(): Promise<void> {
    const next = findNextQueuedUpload();

    if (!next) {
      return;
    }

    const { templateId, upload } = next;

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
        // uploaded_at может отсутствовать, пока файл ещё обрабатывается на бэкенде
        uploadedAt: responseData.uploaded_at ?? responseData.created_at,
        progress: 100,
        status: 'success',
        serverFileId: responseData.file_id,
        rowsCount: responseData.rows_count,
      });

      uploadsMap.value[templateId] = (uploadsMap.value[templateId] || []).filter(
        (item) => item.id !== upload.id,
      );

      // Файл уже попал в /data-load/files — обновляем историю загрузок, чтобы
      // таблица (или переход из пустого состояния в неё) не ждала ручного рефреша
      queryClient.invalidateQueries({ queryKey: [DATASET_HISTORY_QUERY_KEY] });
    } catch {
      upload.status = 'error';
      upload.progress = null;
      upload.error = 'datasets.validation.uploadFailed';

      // Шторка теперь закрывается сразу после старта отправки (см. WT-450) и не
      // ждёт ответа бэка, поэтому инлайн-ошибка в списке файлов может остаться
      // незамеченной — дублируем её тостом, который виден и после закрытия шторки.
      toast.error(`${t('datasets.validation.uploadFailed')} «${upload.source.name}»`);
    }

    isCategoryUploading.value[templateId] = false;

    await runUploadWorker();
  }

  /** Отправляет на бэк все файлы, добавленные локально (по клику на кнопку в футере) */
  async function submitQueuedFiles() {
    isSubmitting.value = true;

    try {
      await Promise.all(Array.from({ length: MAX_CONCURRENT_UPLOADS }, () => runUploadWorker()));
    } finally {
      isSubmitting.value = false;
    }
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
    isSubmitting,
    init,
    addFiles,
    removeFile,
    clearTemplateFiles,
    resetAll,
    downloadTemplateFile,
    submitQueuedFiles,
  };
});
