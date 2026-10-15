import { AxiosError, AxiosHeaders, CanceledError } from 'axios';
import { describe, expect, it } from 'vitest';

import { getHttpStatus, isClientError, isRetryableError } from '../http-error';

function httpError(status: number) {
  return new AxiosError('Request failed', 'ERR_BAD_RESPONSE', undefined, undefined, {
    status,
    statusText: '',
    data: null,
    headers: {},
    config: { headers: new AxiosHeaders() },
  });
}

const networkError = new AxiosError('Network Error', 'ERR_NETWORK');

describe('getHttpStatus', () => {
  it('возвращает статус ответа', () => {
    expect(getHttpStatus(httpError(404))).toBe(404);
  });

  it('возвращает undefined без ответа и для не-axios ошибок', () => {
    expect(getHttpStatus(networkError)).toBeUndefined();
    expect(getHttpStatus(new Error('boom'))).toBeUndefined();
  });
});

describe('isClientError', () => {
  it('true только для 4xx', () => {
    expect(isClientError(httpError(400))).toBe(true);
    expect(isClientError(httpError(499))).toBe(true);
    expect(isClientError(httpError(500))).toBe(false);
    expect(isClientError(networkError)).toBe(false);
  });
});

describe('isRetryableError', () => {
  it('повторяет 5xx и сбой сети', () => {
    expect(isRetryableError(httpError(500))).toBe(true);
    expect(isRetryableError(httpError(503))).toBe(true);
    expect(isRetryableError(networkError)).toBe(true);
  });

  it('не повторяет 4xx, отмену и не-axios ошибки', () => {
    expect(isRetryableError(httpError(401))).toBe(false);
    expect(isRetryableError(httpError(404))).toBe(false);
    expect(isRetryableError(new CanceledError())).toBe(false);
    expect(isRetryableError(new Error('boom'))).toBe(false);
  });
});
