import { createI18n } from 'vue-i18n';

import { en } from './locales/en';
import { ru } from './locales/ru';

export const SUPPORTED_LOCALES = ['ru', 'en'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

const LOCALE_STORAGE_KEY = 'app_locale';

function isAppLocale(value: unknown): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}

// The module is imported by plain `node` unit tests (manifest: node is the default test
// environment): browser globals are touched only when they exist
const hasDom = typeof document !== 'undefined' && typeof localStorage !== 'undefined';

function readStoredLocale(): AppLocale {
  const stored = hasDom ? localStorage.getItem(LOCALE_STORAGE_KEY) : null;
  return isAppLocale(stored) ? stored : 'ru';
}

export const i18n = createI18n({
  legacy: false,
  locale: readStoredLocale(),
  fallbackLocale: 'ru',
  messages: { ru, en },
});

// <html lang> follows the interface language (screen readers, hyphenation, browser translate)
function syncDocumentLang(locale: AppLocale): void {
  if (hasDom) document.documentElement.lang = locale;
}

syncDocumentLang(i18n.global.locale.value);

/** Переключает язык интерфейса и сохраняет выбор — переживает обновление страницы */
export function setAppLocale(locale: AppLocale): void {
  i18n.global.locale.value = locale;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  syncDocumentLang(locale);
}

export function getAppLocale(): AppLocale {
  return i18n.global.locale.value;
}

// Тег для Intl.* — даты/числа форматируются в языке интерфейса. en-US, а не en-GB:
// у en-GB сокращение сентября "Sept", а в макетах везде трехбуквенные месяцы
const INTL_LOCALE_BY_APP_LOCALE: Record<AppLocale, string> = {
  ru: 'ru-RU',
  en: 'en-US',
};

export function toIntlLocale(locale: string): string {
  return isAppLocale(locale) ? INTL_LOCALE_BY_APP_LOCALE[locale] : INTL_LOCALE_BY_APP_LOCALE.ru;
}
