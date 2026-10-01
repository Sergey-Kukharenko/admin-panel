import { ref } from 'vue';

import type { ValidationErrors } from '@/entities/dataset';
import { datasetApi } from '@/entities/dataset';
import { getAppLocale } from '@/shared/i18n';
import { downloadBlob } from '@/shared/lib/downloadBlob';
import { getContentDispositionFilename } from '@/shared/lib/getContentDispositionFilename';

import type { ErrorDetails } from '../ui/DatasetHistoryErrorDialog.vue';
import { formatDatasetGroupDate } from './utils';

interface ErrorFile {
  file_id: string;
  name: string;
  rowsCount: number;
  validation_errors?: ValidationErrors | null;
}

// Считаем реальное число ошибок из validation_errors вместо заглушки — суммируем все
// категории (missing_required_columns/missing_values/wrong_column_type/not_allowed_values/
// extra_columns/header_errors) без дедупликации по колонкам.
function countValidationErrors(errors: ValidationErrors | null | undefined): number {
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

// players.csv -> players_errors.xlsx; имя без расширения тоже получает суффикс
export function toErrorsReportFileName(fileName: string): string {
  return `${fileName.replace(/\.[^./]+$/, '')}_errors.xlsx`;
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
      // Бэк отдает отчет в XLSX и на языке из lang — берем язык интерфейса
      const response = await datasetApi.downloadFileErrors(
        activeFile.value.file_id,
        getAppLocale(),
      );
      // Имя отчета задает бэк (Content-Disposition); свое — только если заголовка нет
      const errorsFileName =
        getContentDispositionFilename(response.headers['content-disposition']) ??
        toErrorsReportFileName(activeFile.value.name);
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
