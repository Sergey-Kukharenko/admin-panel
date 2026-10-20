// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';

import { getAppLocale, i18n, setAppLocale } from '../index';

describe('setAppLocale', () => {
  afterEach(() => {
    setAppLocale('ru');
  });

  it('switches the interface language', () => {
    setAppLocale('en');

    expect(i18n.global.locale.value).toBe('en');
    expect(getAppLocale()).toBe('en');
  });

  it('remembers the choice in localStorage (survives a reload)', () => {
    setAppLocale('en');

    expect(localStorage.getItem('app_locale')).toBe('en');
  });

  it('keeps <html lang> in sync for screen readers and hyphenation', () => {
    setAppLocale('en');
    expect(document.documentElement.lang).toBe('en');

    setAppLocale('ru');
    expect(document.documentElement.lang).toBe('ru');
  });
});
