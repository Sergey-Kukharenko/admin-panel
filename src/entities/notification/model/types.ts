export type NotificationVariant = 'processing' | 'ai' | 'success' | 'error' | 'loop';

export interface Notification {
  id: string;
  variant: NotificationVariant;
  /** Ключ i18n с текстом уведомления (моки без реального backend, см. entities/notification/model/data.ts) */
  titleKey: string;
  /** Ключ i18n с относительным временем уведомления */
  timeKey: string;
  isRead: boolean;
}
