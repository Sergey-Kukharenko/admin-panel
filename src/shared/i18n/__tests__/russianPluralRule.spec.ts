// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';

import { i18n, russianPluralRule, setAppLocale } from '../index';

describe('russianPluralRule', () => {
  afterEach(() => setAppLocale('ru'));

  it.each([
    [0, 2],
    [1, 0],
    [2, 1],
    [4, 1],
    [5, 2],
    [11, 2],
    [12, 2],
    [14, 2],
    [21, 0],
    [22, 1],
    [25, 2],
    [101, 0],
    [111, 2],
    [148000, 2],
    [1500001, 0],
  ])('%i → form %i of "one | few | many"', (count, form) => {
    expect(russianPluralRule(count, 3)).toBe(form);
  });

  it('keeps the vue-i18n default rule for messages with two or four forms', () => {
    expect([0, 1, 5].map((count) => russianPluralRule(count, 2))).toEqual([1, 0, 1]);
    expect([0, 1, 2, 7].map((count) => russianPluralRule(count, 4))).toEqual([0, 1, 2, 2]);
  });

  it('is used by vue-i18n for Russian plural messages', () => {
    const { t } = i18n.global;

    expect(t('dashboard.dataChart.rows', 1)).toBe('Строка');
    expect(t('dashboard.dataChart.rows', 3)).toBe('Строки');
    expect(t('dashboard.dataChart.rows', 148000)).toBe('Строк');

    setAppLocale('en');
    expect(t('dashboard.dataChart.rows', 1)).toBe('Row');
    expect(t('dashboard.dataChart.rows', 0)).toBe('Rows');
  });
});
