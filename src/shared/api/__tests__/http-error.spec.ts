import { AxiosError, AxiosHeaders, CanceledError } from 'axios';
import { describe, expect, it } from 'vitest';

import { getHttpStatus, isClientError, isRetryableError } from '../http-error';

function httpError(status: number) {
  return new AxiosError('Request failed', 'ERR_BAD_RESPONSE', undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: null,
  });
}

describe('getHttpStatus', () => {
  it('returns the response status of an axios error', () => {
    expect(getHttpStatus(httpError(409))).toBe(409);
  });

  it('returns undefined for a network error without a response', () => {
    expect(getHttpStatus(new AxiosError('Network Error', 'ERR_NETWORK'))).toBeUndefined();
  });

  it('returns undefined for a non-axios error', () => {
    expect(getHttpStatus(new Error('boom'))).toBeUndefined();
  });
});

describe('isClientError', () => {
  it.each([400, 401, 404, 409, 422])('treats %i as a client error', (status) => {
    expect(isClientError(httpError(status))).toBe(true);
  });

  it.each([500, 502, 503])('does not treat %i as a client error', (status) => {
    expect(isClientError(httpError(status))).toBe(false);
  });

  it('does not treat a network error as a client error', () => {
    expect(isClientError(new AxiosError('Network Error', 'ERR_NETWORK'))).toBe(false);
  });
});

describe('isRetryableError', () => {
  it.each([500, 503])('retries %i', (status) => {
    expect(isRetryableError(httpError(status))).toBe(true);
  });

  it('retries a network error without a response', () => {
    expect(isRetryableError(new AxiosError('Network Error', 'ERR_NETWORK'))).toBe(true);
  });

  it.each([401, 404, 409])('does not retry %i', (status) => {
    expect(isRetryableError(httpError(status))).toBe(false);
  });

  it('does not retry a cancelled request or a non-axios error', () => {
    expect(isRetryableError(new CanceledError())).toBe(false);
    expect(isRetryableError(new Error('boom'))).toBe(false);
  });
});
