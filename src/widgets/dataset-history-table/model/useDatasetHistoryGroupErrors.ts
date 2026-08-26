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

// Считаем реальное число ошибок из validation_errors вместо заглушки — суммируем все
// категории (missing_required_columns/missing_values/wrong_column_type/not_allowed_values/
// extra_columns/header_errors) без дедупликации по колонкам.
function countValidationErrors(errors: UploadedDatasetFile['validation_errors']): number {
  if (!errors) {
    return 0;
  }

  return (
    (errors.missing_required_columns?.length ?? 0) +
    (errors.missing_values?.length ?? 0) +
    Object.keys(errors.wrong_column_type ?? {}).length +
    Object.keys(errors.not_allowed_values ?? {}).length +
    (errors.extra_columns?.length ?? 0) +
    (errors.header_errors?.length ?? 0)
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
      const response = await datasetApi.downloadFileErrors(activeFile.value.file_id);
      const errorsFileName = activeFile.value.name.replace(/\.csv$/i, '_errors.csv');
      downloadBlob(response.data, errorsFileName);
    } catch (e) {
      console.error('Не удалось скачать отчет с ошибками:', e);
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
