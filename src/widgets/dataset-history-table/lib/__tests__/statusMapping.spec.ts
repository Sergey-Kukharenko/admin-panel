import { describe, expect, it } from 'vitest';

import { mapSourceTypeToLabel } from '../sourceMapping';
import { mapBackendStatusToUi, mapUiStatusToBackend } from '../statusMapping';

describe('mapUiStatusToBackend', () => {
  it('expands LOADING into two backend statuses', () => {
    expect(mapUiStatusToBackend('SUCCESS')).toBe('succeeded');
    expect(mapUiStatusToBackend('ERROR')).toBe('failed');
    expect(mapUiStatusToBackend('LOADING')).toBe('awaiting,processing');
    expect(mapUiStatusToBackend('')).toBeUndefined();
  });
});

describe('mapBackendStatusToUi', () => {
  it('maps awaiting, processing and unknown statuses to LOADING', () => {
    expect(mapBackendStatusToUi('succeeded')).toBe('SUCCESS');
    expect(mapBackendStatusToUi('failed')).toBe('ERROR');
    expect(mapBackendStatusToUi('awaiting')).toBe('LOADING');
    expect(mapBackendStatusToUi('processing')).toBe('LOADING');
    expect(mapBackendStatusToUi('something_new')).toBe('LOADING');
  });
});

describe('mapSourceTypeToLabel', () => {
  it('labels known channels case-insensitively', () => {
    expect(mapSourceTypeToLabel('CLIENT_PORTAL')).toBe('CSV');
    expect(mapSourceTypeToLabel('s3')).toBe('S3');
    expect(mapSourceTypeToLabel('Api')).toBe('API');
  });

  it('shows an unknown code readably', () => {
    expect(mapSourceTypeToLabel('ftp_upload')).toBe('FTP UPLOAD');
  });
});
