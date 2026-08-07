import type { Product } from '@/entities/product';

import type { ScheduleEvent } from './types';

export interface DatedScheduleEvent {
  id: string;
  date: Date;
  title: string;
  /** next_prediction_date приходит без времени (format: date), last_prediction_at — с ним */
  hasTime: boolean;
}

/**
 * В контракте бэкенда нет отдельного эндпоинта расписания/таймлайна — события собираем
 * из уже известных полей каждого сервиса продукта: последний реальный расчет
 * (last_prediction_at) и запланированный следующий (next_prediction_date). Промежуточные
 * стадии из старого мока ("данные получены", "старт подготовки ML-продуктов" и т.п.)
 * бэкенд не отдает, поэтому они не попадают в реальное расписание.
 */
export function buildScheduleEvents(products: Product[]): DatedScheduleEvent[] {
  const events: DatedScheduleEvent[] = [];

  for (const product of products) {
    for (const service of product.services) {
      if (service.last_prediction_at) {
        events.push({
          id: `${service.ml_service_id}-last`,
          date: new Date(service.last_prediction_at),
          title: `${service.name} готов`,
          hasTime: true,
        });
      }

      if (service.next_prediction_date) {
        events.push({
          id: `${service.ml_service_id}-next`,
          date: new Date(service.next_prediction_date),
          title: `Следующий расчет: ${service.name}`,
          hasTime: false,
        });
      }
    }
  }

  return events;
}

const weekdayFormatter = new Intl.DateTimeFormat('ru-RU', { weekday: 'short', timeZone: 'UTC' });

export function toScheduleEvent(event: DatedScheduleEvent): ScheduleEvent {
  const dayOfWeek = weekdayFormatter.format(event.date).replace('.', '');
  const dayOfMonth = String(event.date.getUTCDate()).padStart(2, '0');

  const parts = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    ...(event.hasTime ? { hour: '2-digit' as const, minute: '2-digit' as const } : {}),
    timeZone: 'UTC',
  }).formatToParts(event.date);

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  const month = getPart('month').replace(/\.$/, '');
  const timeSuffix = event.hasTime ? `, ${getPart('hour')}:${getPart('minute')}` : '';

  return {
    id: event.id,
    dayOfWeek,
    dayOfMonth,
    title: event.title,
    formattedTime: `${getPart('day')} ${month}${timeSuffix}`,
  };
}
