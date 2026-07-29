import { ref } from 'vue';

import { datasetApi } from '@/entities/dataset';
import { downloadBlob } from '@/shared/lib/downloadBlob';

import type { ErrorDetails } from '../ui/DatasetHistoryErrorDialog.vue';
import { formatDatasetGroupDate } from './utils';

interface ErrorFile {
  file_id: string;
  name: string;
  rowsCount: number;
}

export function useDatasetHistoryGroupErrors(groupDate: string) {
  const isOpen = ref(false);
  const details = ref<ErrorDetails | null>(null);
  const activeFile = ref<ErrorFile | null>(null);

  function open(file: ErrorFile, categoryTitle: string) {
    activeFile.value = file;

    details.value = {
      uploadDate: formatDatasetGroupDate(groupDate),
      fileNames: [file.name],
      dataType: categoryTitle.toLowerCase(),
      checkedRows: file.rowsCount,
      errorColumns: 3,
      errorsFound: 3,
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
