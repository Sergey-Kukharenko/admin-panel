import { createI18n } from 'vue-i18n';

import { en } from './locales/en';
import { ru } from './locales/ru';

export const SUPPORTED_LOCALES = ['ru', 'en'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

const LOCALE_STORAGE_KEY = 'app_locale';

function isAppLocale(value: unknown): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}

function readStoredLocale(): AppLocale {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return isAppLocale(stored) ? stored : 'ru';
}

export const i18n = createI18n({
  legacy: false,
  locale: readStoredLocale(),
  fallbackLocale: 'ru',
  messages: { ru, en },
});

/** Переключает язык интерфейса и сохраняет выбор — переживает обновление страницы */
export function setAppLocale(locale: AppLocale): void {
  i18n.global.locale.value = locale;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export function getAppLocale(): AppLocale {
  return i18n.global.locale.value;
}
