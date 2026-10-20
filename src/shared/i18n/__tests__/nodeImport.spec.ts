// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { i18n } from '../index';

// Manifest: unit tests run in node by default; pure modules (mappers, display names) import i18n
describe('shared/i18n in the node environment', () => {
  it('imports without browser globals and falls back to Russian', () => {
    expect(i18n.global.locale.value).toBe('ru');
    expect(i18n.global.t('common.cancel')).toBe('Отмена');
  });
});
