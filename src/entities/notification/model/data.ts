import type { Notification } from './types';

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    variant: 'processing',
    title: 'VIP Churn Predictor 30d завершил обучение и готов к запуску',
    timeLabel: '5 мин назад',
    isRead: false,
  },
  {
    id: 'n2',
    variant: 'ai',
    title: 'Прогон завершён',
    timeLabel: '2 ч назад',
    isRead: false,
  },
  {
    id: 'n3',
    variant: 'success',
    title: 'Данные успешно загружены через CSV (145,000 строк)',
    timeLabel: '5 ч назад',
    isRead: false,
  },
  {
    id: 'n4',
    variant: 'error',
    title: 'Ошибка загрузки файла payments.csv — неверная структура колонок',
    timeLabel: '1 д назад',
    isRead: false,
  },
  {
    id: 'n5',
    variant: 'loop',
    title: 'VIP Churn Predictor 30d завершил обучение и готов к запуску',
    timeLabel: '1 д назад',
    isRead: false,
  },
  {
    id: 'n6',
    variant: 'processing',
    title: 'Прогон VIP CLV Predictor завершён (145,000 строк)',
    timeLabel: '2 д назад',
    isRead: false,
  },
  {
    id: 'n7',
    variant: 'ai',
    title: 'Recommender System завершил обучение и готов к запуску',
    timeLabel: '3 д назад',
    isRead: false,
  },
  {
    id: 'n8',
    variant: 'processing',
    title: 'Прогон Recommender System завершён (98,500 строк)',
    timeLabel: '4 д назад',
    isRead: false,
  },
  {
    id: 'n9',
    variant: 'loop',
    title: 'Достигнуто 80% лимита по тарифу VIP Intelligence',
    timeLabel: '5 д назад',
    isRead: false,
  },
];
