import { describe, expect, it } from 'vitest';

import { countValidationErrors } from '../errorsReport';

describe('countValidationErrors', () => {
  it('нет ошибок — 0', () => {
    expect(countValidationErrors(null)).toBe(0);
    expect(countValidationErrors(undefined)).toBe(0);
    expect(countValidationErrors({})).toBe(0);
  });

  it('суммирует все категории: списки по длине, словари по числу колонок', () => {
    expect(
      countValidationErrors({
        missing_required_columns: ['a', 'b'],
        missing_values: ['c'],
        wrong_column_type: { d: { required: 'int' }, e: { required: 'str' } },
        not_allowed_values: { f: ['x', 'y', 'z'] },
        extra_columns: ['g'],
        header_errors: ['h'],
      }),
    ).toBe(8);
  });

  it('детализация (details, expected_values) не считается отдельно', () => {
    expect(
      countValidationErrors({
        missing_values: ['c'],
        missing_values_details: { c: { error_count: 10, sample_rows: [1, 2] } },
        expected_values: { f: ['x'] },
      }),
    ).toBe(1);
  });
});
