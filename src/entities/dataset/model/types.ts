export type DatasetIcon = 'users' | 'vip' | 'bets' | 'balance' | 'payments';

export interface DatasetFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
}

export interface DatasetTemplate {
  id: string;
  title: string;
  description: string;
  icon: DatasetIcon;
  count?: number;

  /**
   * Уже загруженные файлы,
   * полученные с сервера.
   */
  files?: DatasetFile[];
}
