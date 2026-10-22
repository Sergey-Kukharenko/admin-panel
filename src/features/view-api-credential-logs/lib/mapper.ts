import type { ProjectApiCredentialLogItem } from '@/entities/integration';

import type { ApiCredentialLogRecord } from '../model/types';

const EMPTY_VALUE = '—';

/** «22 октября 2026, 14:05:33» / «22 October 2026, 14:05:33» — no «г.» and «в» from Intl */
export function formatLogDate(dateIso: string, intlLocale: string): string {
  const parts = new Intl.DateTimeFormat(intlLocale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(new Date(dateIso));

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';

  return `${part('day')} ${part('month')} ${part('year')}, ${part('hour')}:${part('minute')}:${part('second')}`;
}

export function mapLogItemToRecord(
  item: ProjectApiCredentialLogItem,
  index: number,
  intlLocale: string,
): ApiCredentialLogRecord {
  return {
    // pk is optional in the schema; fall back to the position on the page
    id: item.pk ?? `log-${index}`,
    createdAt: item.created ? formatLogDate(item.created, intlLocale) : EMPTY_VALUE,
    action: item.action ?? EMPTY_VALUE,
    clientIp: item.client_ip ?? EMPTY_VALUE,
  };
}
