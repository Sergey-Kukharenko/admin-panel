import { describe, expect, it } from 'vitest';

import { mapSourceTypeToLabel } from '../sourceMapping';
import { mapBackendStatusToUi, mapUiStatusToBackend } from '../statusMapping';

describe('mapUiStatusToBackend', () => {
  it('LOADING раскрывается в два статуса бэка', () => {
    expect(mapUiStatusToBackend('SUCCESS')).toBe('succeeded');
    expect(mapUiStatusToBackend('ERROR')).toBe('failed');
    expect(mapUiStatusToBackend('LOADING')).toBe('awaiting,processing');
    expect(mapUiStatusToBackend('')).toBeUndefined();
  });
});

describe('mapBackendStatusToUi', () => {
  it('awaiting и processing — это LOADING, неизвестный статус тоже', () => {
    expect(mapBackendStatusToUi('succeeded')).toBe('SUCCESS');
    expect(mapBackendStatusToUi('failed')).toBe('ERROR');
    expect(mapBackendStatusToUi('awaiting')).toBe('LOADING');
    expect(mapBackendStatusToUi('processing')).toBe('LOADING');
    expect(mapBackendStatusToUi('something_new')).toBe('LOADING');
  });
});

describe('mapSourceTypeToLabel', () => {
  it('известные каналы — понятные названия без учёта регистра', () => {
    expect(mapSourceTypeToLabel('CLIENT_PORTAL')).toBe('CSV');
    expect(mapSourceTypeToLabel('s3')).toBe('S3');
    expect(mapSourceTypeToLabel('Api')).toBe('API');
  });

  it('неизвестный код показывается читаемо', () => {
    expect(mapSourceTypeToLabel('ftp_upload')).toBe('FTP UPLOAD');
  });
});
