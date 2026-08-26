import { ref } from 'vue';

import type { UploadedDatasetFile } from '@/entities/dataset';
import { datasetApi } from '@/entities/dataset';
import { downloadBlob } from '@/shared/lib/downloadBlob';

import type { ErrorDetails } from '../ui/DatasetHistoryErrorDialog.vue';
import { formatDatasetGroupDate } from './utils';

interface ErrorFile {
  file_id: string;
  name: string;
  rowsCount: number;
  validation_errors: UploadedDatasetFile['validation_errors'];
}

// Считаем реальное число ошибок из validation_errors вместо заглушки —
// суммируем все категории (missing_columns/missing_values/wrong_column_type/not_allowed_values)
// без дедупликации по колонкам.
function countValidationErrors(errors: UploadedDatasetFile['validation_errors']): number {
  if (!errors) {
    return 0;
  }

  return (
    (errors.missing_columns?.length ?? 0) +
    (errors.missing_values?.length ?? 0) +
    Object.keys(errors.wrong_column_type ?? {}).length +
    Object.keys(errors.not_allowed_values ?? {}).length
  );
}

export function useDatasetHistoryGroupErrors(groupDate: string) {
  const isOpen = ref(false);
  const details = ref<ErrorDetails | null>(null);
  const activeFile = ref<ErrorFile | null>(null);

  function open(file: ErrorFile, categoryTitle: string) {
    activeFile.value = file;

    details.value = {
      checkDate: formatDatasetGroupDate(groupDate),
      dataType: categoryTitle,
      checkedRows: file.rowsCount,
      errorsFound: countValidationErrors(file.validation_errors),
    };

    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  async function download() {
    if (!activeFile.value) return;

    try {
      const response = await datasetApi.downloadFile(activeFile.value.file_id);
      downloadBlob(response.data, activeFile.value.name);
    } catch (e) {
      console.error('Не удалось скачать файл с ошибками:', e);
    }
  }

  return {
    isOpen,
    details,
    open,
    close,
    download,
  };
}
