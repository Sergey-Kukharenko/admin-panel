import { isAxiosError, isCancel } from 'axios';

/** HTTP-статус ответа; undefined — ответа не было (сеть, CORS, отмена) или ошибка не от axios */
export function getHttpStatus(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined;
}

/** 4xx: запрос неверный или запрещён, повтор ничего не изменит */
export function isClientError(error: unknown): boolean {
  const status = getHttpStatus(error);
  return status !== undefined && status >= 400 && status < 500;
}

/** Повторять имеет смысл только сбой сети и 5xx; отменённый запрос не повторяем */
export function isRetryableError(error: unknown): boolean {
  if (isCancel(error)) return false;
  if (!isAxiosError(error)) return false;

  const status = getHttpStatus(error);
  return status === undefined || status >= 500;
}
