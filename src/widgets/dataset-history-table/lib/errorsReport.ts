import type { ValidationErrors } from '@/entities/dataset';

// Считаем реальное число ошибок из validation_errors вместо заглушки — суммируем все
// категории (missing_required_columns/missing_values/wrong_column_type/not_allowed_values/
// extra_columns/header_errors) без дедупликации по колонкам.
export function countValidationErrors(errors: ValidationErrors | null | undefined): number {
  if (!errors) {
    return 0;
  }

  return (
    (errors.missing_required_columns?.length ?? 0) +
    (errors.missing_values?.length ?? 0) +
    Object.keys(errors.wrong_column_type ?? {}).length +
    Object.keys(errors.not_allowed_values ?? {}).length +
    (errors.extra_columns?.length ?? 0) +
    (errors.header_errors?.length ?? 0)
  );
}

// players.csv -> players_errors.xlsx; имя без расширения тоже получает суффикс
export function toErrorsReportFileName(fileName: string): string {
  return `${fileName.replace(/\.[^./]+$/, '')}_errors.xlsx`;
}
