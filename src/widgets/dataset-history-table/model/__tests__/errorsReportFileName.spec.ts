import { describe, expect, it } from 'vitest';

import { toErrorsReportFileName } from '../useDatasetHistoryGroupErrors';

describe('toErrorsReportFileName', () => {
  it('отчет об ошибках сохраняется как XLSX рядом с именем исходного файла', () => {
    expect(toErrorsReportFileName('casino_rewards.csv')).toBe('casino_rewards_errors.xlsx');
    expect(toErrorsReportFileName('Players.CSV')).toBe('Players_errors.xlsx');
  });

  it('имя без расширения тоже получает суффикс', () => {
    expect(toErrorsReportFileName('balances')).toBe('balances_errors.xlsx');
  });
});
