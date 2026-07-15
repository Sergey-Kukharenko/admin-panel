export type DatasetUploadStatus = 'queued' | 'uploading' | 'error';

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
   * Для queued/error может быть null.
   */
  progress: number | null;

  /**
   * Текст ошибки.
   */
  error?: string;
}
