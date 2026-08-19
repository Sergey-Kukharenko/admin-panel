export type NotificationVariant = 'processing' | 'ai' | 'success' | 'error' | 'loop';

export interface Notification {
  id: string;
  variant: NotificationVariant;
  title: string;
  timeLabel: string;
  isRead: boolean;
}
