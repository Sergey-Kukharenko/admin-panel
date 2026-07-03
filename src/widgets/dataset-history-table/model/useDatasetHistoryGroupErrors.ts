import { ref } from 'vue';

import type { ErrorDetails } from '../ui/DatasetHistoryErrorDialog.vue';

export function useDatasetHistoryGroupErrors(groupDate: string) {
  const isOpen = ref(false);
  const details = ref<ErrorDetails | null>(null);

  function open(file: { name: string; rowsCount: number }, categoryTitle: string) {
    details.value = {
      uploadDate: `${groupDate}, 03:16`,
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

  function download() {
    if (!details.value) return;

    console.log('Download error file:', details.value.fileNames);
  }

  return {
    isOpen,
    details,
    open,
    close,
    download,
  };
}
