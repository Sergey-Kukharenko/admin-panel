import { isAxiosError, isCancel } from 'axios';

/** HTTP status of a failed request; undefined for network errors and non-HTTP errors */
export function getHttpStatus(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined;
}

/** 4xx — retrying will not help, the request itself has to change */
export function isClientError(error: unknown): boolean {
  const status = getHttpStatus(error);
  return status !== undefined && status >= 400 && status < 500;
}

/** Only network failures and 5xx are worth retrying; a cancelled request is not retried */
export function isRetryableError(error: unknown): boolean {
  if (isCancel(error) || !isAxiosError(error)) return false;

  const status = getHttpStatus(error);
  return status === undefined || status >= 500;
}
