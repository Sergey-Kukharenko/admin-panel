/** Дата создания ключа как в макете: «02 октября 2026» — день двумя цифрами, без «г.» */
export function formatSecretDate(dateIso: string, locale: string): string {
  const parts = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).formatToParts(new Date(dateIso));

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';

  return `${part('day')} ${part('month')} ${part('year')}`;
}
