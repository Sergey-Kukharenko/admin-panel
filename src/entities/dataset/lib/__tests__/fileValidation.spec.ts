import { describe, expect, it } from 'vitest';

import {
  DATASET_FILE_ERRORS,
  DATASET_MAX_FILE_SIZE_BYTES,
  getDatasetFileValidationError,
} from '../fileValidation';

function fakeFile(name: string, size: number, type = '') {
  return { name, size, type } as File;
}

describe('getDatasetFileValidationError', () => {
  it('корректный CSV проходит', () => {
    expect(getDatasetFileValidationError(fakeFile('players.csv', 100))).toBeUndefined();
    expect(getDatasetFileValidationError(fakeFile('PLAYERS.CSV', 100))).toBeUndefined();
  });

  it('CSV по MIME-типу проходит даже без расширения', () => {
    expect(getDatasetFileValidationError(fakeFile('export', 100, 'text/csv'))).toBeUndefined();
  });

  it('другой формат отклоняется', () => {
    expect(getDatasetFileValidationError(fakeFile('players.xlsx', 100))).toBe(
      DATASET_FILE_ERRORS.unsupportedFormat,
    );
  });

  it('пустой и слишком большой файл отклоняются раньше проверки формата', () => {
    expect(getDatasetFileValidationError(fakeFile('a.xlsx', 0))).toBe(DATASET_FILE_ERRORS.empty);
    expect(getDatasetFileValidationError(fakeFile('a.csv', DATASET_MAX_FILE_SIZE_BYTES + 1))).toBe(
      DATASET_FILE_ERRORS.tooLarge,
    );
    expect(
      getDatasetFileValidationError(fakeFile('a.csv', DATASET_MAX_FILE_SIZE_BYTES)),
    ).toBeUndefined();
  });
});
