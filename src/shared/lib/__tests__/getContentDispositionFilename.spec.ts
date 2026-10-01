import { describe, expect, it } from 'vitest';

import { getContentDispositionFilename } from '../getContentDispositionFilename';

describe('getContentDispositionFilename', () => {
  it('берет имя из filename в кавычках (ответ /predictions/{id}/download)', () => {
    expect(
      getContentDispositionFilename(
        'attachment; filename="vip-segment-prediction_20260929173140.csv"',
      ),
    ).toBe('vip-segment-prediction_20260929173140.csv');
  });

  it('берет имя без кавычек', () => {
    expect(getContentDispositionFilename('attachment; filename=result.csv')).toBe('result.csv');
  });

  it('предпочитает filename* в UTF-8', () => {
    expect(
      getContentDispositionFilename(
        'attachment; filename="result.csv"; filename*=UTF-8\'\'%D0%BE%D1%82%D1%87%D0%B5%D1%82.csv',
      ),
    ).toBe('отчет.csv');
  });

  it('без заголовка или имени — null', () => {
    expect(getContentDispositionFilename(undefined)).toBeNull();
    expect(getContentDispositionFilename('attachment')).toBeNull();
  });
});
