export const DATASET_MAX_FILE_SIZE_BYTES = 512 * 1024 * 1024;

export const DATASET_ALLOWED_FILE_EXTENSION = '.csv';
export const DATASET_ALLOWED_MIME_TYPE = 'text/csv';

// Значения — ключи i18n, а не готовый текст: ошибка может пролежать в очереди
// дольше, чем пользователь остаётся на одном языке интерфейса (см. datasets.validation.*)
export const DATASET_FILE_ERRORS = {
  tooLarge: 'datasets.validation.tooLarge',
  empty: 'datasets.validation.empty',
  unsupportedFormat: 'datasets.validation.unsupportedFormat',
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
