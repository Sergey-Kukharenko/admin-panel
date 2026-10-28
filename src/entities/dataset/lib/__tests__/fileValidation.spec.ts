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
  it('accepts a valid CSV', () => {
    expect(getDatasetFileValidationError(fakeFile('players.csv', 100))).toBeUndefined();
    expect(getDatasetFileValidationError(fakeFile('PLAYERS.CSV', 100))).toBeUndefined();
  });

  it('accepts a CSV by MIME type even without the extension', () => {
    expect(getDatasetFileValidationError(fakeFile('export', 100, 'text/csv'))).toBeUndefined();
  });

  it('rejects another format', () => {
    expect(getDatasetFileValidationError(fakeFile('players.xlsx', 100))).toBe(
      DATASET_FILE_ERRORS.unsupportedFormat,
    );
  });

  it('rejects empty and oversized files before the format check', () => {
    expect(getDatasetFileValidationError(fakeFile('a.xlsx', 0))).toBe(DATASET_FILE_ERRORS.empty);
    expect(getDatasetFileValidationError(fakeFile('a.csv', DATASET_MAX_FILE_SIZE_BYTES + 1))).toBe(
      DATASET_FILE_ERRORS.tooLarge,
    );
    expect(
      getDatasetFileValidationError(fakeFile('a.csv', DATASET_MAX_FILE_SIZE_BYTES)),
    ).toBeUndefined();
  });
});
