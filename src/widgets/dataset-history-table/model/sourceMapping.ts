/**
 * Backend отдаёт source_type как технический код канала загрузки (например, "CLIENT_PORTAL"
 * для файлов, загруженных через UI вручную) — в интерфейсе нужно показывать понятное
 * пользователю название канала (CSV / S3 / API), а не код как есть (см. WT-425)
 */
const SOURCE_TYPE_LABELS: Record<string, string> = {
  client_portal: 'CSV',
  s3: 'S3',
  api: 'API',
};

export function mapSourceTypeToLabel(sourceType: string): string {
  const normalized = sourceType.toLowerCase();

  return SOURCE_TYPE_LABELS[normalized] ?? sourceType.replaceAll('_', ' ').toUpperCase();
}
