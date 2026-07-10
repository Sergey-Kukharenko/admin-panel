export const DATASET_MAX_FILE_SIZE_BYTES = 500;

export const DATASET_ALLOWED_FILE_EXTENSION = '.csv';
export const DATASET_ALLOWED_MIME_TYPE = 'text/csv';

export const DATASET_FILE_ERRORS = {
  tooLarge: 'Размер превышает 500 МБ',
  empty: 'Файл не содержит данных',
  unsupportedFormat: 'Поддерживается только CSV',
} as const;

export const getDatasetFileValidationError = (file: File): string | undefined => {
  const normalizedFileName = file.name.toLowerCase();

  if (file.size > DATASET_MAX_FILE_SIZE_BYTES) {
    return DATASET_FILE_ERRORS.tooLarge;
  }

  if (file.size === 0) {
    return DATASET_FILE_ERRORS.empty;
  }

  if (
    !normalizedFileName.endsWith(DATASET_ALLOWED_FILE_EXTENSION) &&
    file.type !== DATASET_ALLOWED_MIME_TYPE
  ) {
    return DATASET_FILE_ERRORS.unsupportedFormat;
  }

  return undefined;
};
