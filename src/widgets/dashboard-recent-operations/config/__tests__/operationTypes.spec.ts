// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { i18n } from '@/shared/i18n';

import { OPERATION_TYPE_LABEL_KEYS, OTHER_OPERATION_LABEL_KEY } from '../operationTypes';

// The keys are plain strings for the type check: a typo would show the raw key in the table
describe('operation type label keys', () => {
  it.each([...Object.values(OPERATION_TYPE_LABEL_KEYS), OTHER_OPERATION_LABEL_KEY])(
    '%s exists in ru and en',
    (key) => {
      expect(i18n.global.te(key, 'ru')).toBe(true);
      expect(i18n.global.te(key, 'en')).toBe(true);
    },
  );
});
