import type { ScheduleEvent } from './types';

export const predictionProcessingScheduleMonth = 'Июл 2026';

export const predictionProcessingScheduleItems: ScheduleEvent[] = [
  {
    id: 'waiting-for-data',
    dayOfWeek: 'вт',
    dayOfMonth: '09',
    title: 'Ожидание загрузки данных',
    formattedTime: '9 июл, 00:00',
  },
  {
    id: 'data-received',
    dayOfWeek: 'вт',
    dayOfMonth: '09',
    title: 'Данные получены',
    formattedTime: '09 июл, 10:42',
  },
  {
    id: 'ml-products-preparation-started',
    dayOfWeek: 'вт',
    dayOfMonth: '09',
    title: 'Старт подготовки ML-продуктов',
    formattedTime: '09 июл, 10:12',
  },
  {
    id: 'player-intelligence-ready',
    dayOfWeek: 'сб',
    dayOfMonth: '18',
    title: 'Player Intelligence готов',
    formattedTime: '18 июл, 10:12',
  },
  {
    id: 'recommender-system-ready',
    dayOfWeek: 'сб',
    dayOfMonth: '18',
    title: 'Recommender system готов',
    formattedTime: '18 июл, 10:12',
  },
  {
    id: 'early-vip-ready',
    dayOfWeek: 'пн',
    dayOfMonth: '20',
    title: 'Early VIP результат готов',
    formattedTime: '20 июл, 10:12',
  },
  {
    id: 'vip-churn-ready',
    dayOfWeek: 'пн',
    dayOfMonth: '20',
    title: 'VIP Churn результат готов',
    formattedTime: '20 июл, 10:12',
  },
];
