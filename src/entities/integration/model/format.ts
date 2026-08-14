import type { ApiSecretProductAccess } from './types';

const DATE_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatSecretDate(dateIso: string): string {
  return DATE_FORMATTER.format(new Date(dateIso));
}

export function formatPermissionsSummary(productAccess: ApiSecretProductAccess[]): string {
  const hasWriteData = productAccess.some((access) => access.writeData);
  const hasReadResults = productAccess.some((access) => access.readResults);

  const labels: string[] = [];
  if (hasWriteData) labels.push('Upload data');
  if (hasReadResults) labels.push('Read results');

  return labels.length > 0 ? labels.join(', ') : '—';
}
