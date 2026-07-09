export type DatasetUploadStatus = 'queued' | 'uploading' | 'success' | 'error';

export interface DatasetUpload {
  /**
   * Локальный id элемента очереди.
   */
  id: string;

  /**
   * Исходный файл, выбранный пользователем.
   */
  source: File;

  /**
   * Текущий статус загрузки.
   */
  status: DatasetUploadStatus;

  /**
   * Прогресс загрузки (0–100).
   * Для queued может быть null.
   */
  progress: number | null;

  /**
   * Текст ошибки.
   */
  error?: string;
}
