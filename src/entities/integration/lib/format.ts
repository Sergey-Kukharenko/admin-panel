import type { ApiSecretProductAccess } from '../model/types';

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

/** Колонка «Права доступа» в макете — продукты, к которым у ключа есть доступ */
export function formatProductsWithAccess(productAccess: ApiSecretProductAccess[]): string {
  const products = productAccess
    .filter((access) => access.writeData || access.readResults)
    .map((access) => access.productName);

  return products.length > 0 ? products.join(', ') : '—';
}
