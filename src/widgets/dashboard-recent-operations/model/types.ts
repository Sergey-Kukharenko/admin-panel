import type { AppStatusBadgeStatus } from '@/shared/ui/app-status-badge';

/** One row of the «Последние операции» table, ready to show */
export interface RecentOperationRow {
  id: string;
  /** "1 июл 2026, 11:10" */
  dateLabel: string;
  /** "Загрузка данных" / "Прогон модели" */
  typeLabel: string;
  /** "bets · CSV · 145 000 строк", "VIP Churn · 145 000 строк"; "-" when there is nothing to show */
  details: string;
  status: AppStatusBadgeStatus;
}

/** What the table shows once the operations are loaded */
export interface RecentOperationsView {
  rows: RecentOperationRow[];
  /** All operations of the project, the counter of the header (more than the rows shown) */
  totalCount: number;
}
