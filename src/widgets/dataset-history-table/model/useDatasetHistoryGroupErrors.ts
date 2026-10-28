import { ref } from 'vue';

import type { ValidationErrors } from '@/entities/dataset';
import { datasetApi } from '@/entities/dataset';
import { getAppLocale, toIntlLocale } from '@/shared/i18n';
import { downloadBlob } from '@/shared/lib/downloadBlob';
import { getContentDispositionFilename } from '@/shared/lib/getContentDispositionFilename';

import { countValidationErrors, toErrorsReportFileName } from '../lib/errorsReport';
import { formatDatasetGroupDate } from '../lib/utils';
import type { ErrorDetails } from './types';

interface ErrorFile {
  file_id: string;
  name: string;
  rowsCount: number;
  validation_errors?: ValidationErrors | null;
}

export function useDatasetHistoryGroupErrors(groupDate: string) {
  const isOpen = ref(false);
  const details = ref<ErrorDetails | null>(null);
  const activeFile = ref<ErrorFile | null>(null);

  function open(file: ErrorFile, categoryTitle: string) {
    activeFile.value = file;

    details.value = {
      checkDate: formatDatasetGroupDate(groupDate, toIntlLocale(getAppLocale())),
      dataType: categoryTitle,
      checkedRows: file.rowsCount,
      errorsFound: countValidationErrors(file.validation_errors),
    };

    isOpen.value = true;
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
    download,
  };
}
