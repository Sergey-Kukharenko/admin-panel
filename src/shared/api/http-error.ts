import { isAxiosError } from 'axios';

/** HTTP status of a failed request; undefined for network errors and non-HTTP errors */
export function getHttpStatus(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined;
}

/** 4xx — retrying will not help, the request itself has to change */
export function isClientError(error: unknown): boolean {
  const status = getHttpStatus(error);
  return status !== undefined && status >= 400 && status < 500;
}
