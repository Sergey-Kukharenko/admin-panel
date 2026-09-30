import { describe, expect, it } from 'vitest';

import type { Product } from '@/entities/product';

import { mapProductToIntegrations } from '../mapper';

// Ответ /products со стенда (сентябрь 2026) — системные slug'и в name, статусы в нижнем регистре
const playerIntelligence: Product = {
  product_id: 'caef651a-5af9-4330-b087-55a144e0abc6',
  name: 'player-intelligence',
  product_status: 'awaiting',
  last_product_run_status: 'processing',
  last_prediction_at: '2026-09-23T21:23:45.792395Z',
  next_prediction_date: '2026-09-25T00:00:00Z',
  services: [
    {
      ml_service_id: '9a54bebd-835b-4f5b-bef5-9f6763f86615',
      name: 'previp-detection_3',
      service_status: 'awaiting',
      last_service_run_status: 'processing',
      last_prediction_at: '2026-09-23T21:23:45.792395Z',
      next_prediction_date: '2026-09-25',
    },
  ],
};

const gameRecommender: Product = {
  product_id: '71b354e5-ee3f-4fa0-a49a-b933d3c071a1',
  name: 'game-recommender',
  product_status: 'awaiting',
  last_product_run_status: null,
  last_prediction_at: null,
  next_prediction_date: '2026-09-26T00:00:00Z',
  services: [
    {
      ml_service_id: '31612a9d-0784-4cd3-9e12-70c70ae83d1f',
      name: 'similar',
      service_status: 'awaiting',
      last_service_run_status: null,
      last_prediction_at: null,
      next_prediction_date: '2026-09-26',
    },
  ],
};

const options = {
  intlLocale: 'ru-RU',
  productName: (slug: string) => `product:${slug}`,
  serviceName: (slug: string) => `service:${slug}`,
};

describe('mapProductToIntegrations', () => {
  it('показывает generating и дату последнего расчета без времени, если результат уже есть', () => {
    const [card] = mapProductToIntegrations(playerIntelligence, { ...options, isDataReady: false });

    expect(card).toMatchObject({
      status: 'generating',
      isTraining: false,
      // Результаты уже выдавались — сервис рабочий, повторная загрузка не откатывает в AWAITING
      serviceState: 'ready',
      tooltipIcon: 'service-ready',
      category: 'product:player-intelligence',
      name: 'service:previp-detection_3',
      iconName: 'player-intelligence',
      lastCalculation: '23 сент, 2026',
      nextCalculation: '25 сент, 2026',
    });
  });

  it('держит AWAITING с иконкой «данные не загружены», пока валидатор не дал is_ready', () => {
    const [card] = mapProductToIntegrations(gameRecommender, { ...options, isDataReady: false });

    expect(card).toMatchObject({
      status: 'awaiting',
      serviceState: 'awaitingData',
      tooltipIcon: 'not-yet-loaded',
      iconName: 'game-recommendations',
      lastCalculation: null,
    });
  });

  it('после валидации данных показывает, что подготовка продукта началась', () => {
    const [card] = mapProductToIntegrations(gameRecommender, { ...options, isDataReady: true });

    expect(card).toMatchObject({ status: 'awaiting', serviceState: 'training' });
  });

  it('ошибка инференса красит бейдж, но не info-иконку (макет «Результат с ошибкой»)', () => {
    const [card] = mapProductToIntegrations(
      {
        ...playerIntelligence,
        services: [
          {
            ...playerIntelligence.services[0]!,
            service_status: 'active',
            last_service_run_status: 'error',
          },
        ],
      },
      options,
    );

    expect(card).toMatchObject({ status: 'failed', tooltipIcon: 'service-ready' });
  });

  it('ошибка первичного обучения блокирует карточку иконкой error', () => {
    const [card] = mapProductToIntegrations(
      {
        ...gameRecommender,
        services: [{ ...gameRecommender.services[0]!, service_status: 'error' }],
      },
      { ...options, isDataReady: true },
    );

    expect(card).toMatchObject({
      status: 'failed',
      serviceState: 'trainingFailed',
      tooltipIcon: 'error',
    });
  });

  it('форматирует даты в языке интерфейса', () => {
    const [card] = mapProductToIntegrations(playerIntelligence, {
      ...options,
      intlLocale: 'en-US',
    });

    expect(card?.lastCalculation).toBe('23 Sep, 2026');
  });

  // Пример будущего ответа /products от бэка (25.09.2026): агрегированный статус продукта,
  // next_prediction_date в формате date-time
  describe('новый формат /products', () => {
    const vipIntelligence: Product = {
      product_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      name: 'VIP Intelligence',
      product_status: 'active',
      last_product_run_status: 'completed',
      last_prediction_at: '2026-09-22T14:12:05.123456Z',
      next_prediction_date: '2026-09-26T00:00:00.000000Z',
      services: [
        {
          ml_service_id: '11111111-1111-1111-1111-111111111111',
          name: 'vip_churn',
          service_status: 'active',
          last_service_run_status: 'processing',
          last_prediction_at: null,
          next_prediction_date: '2026-09-25T00:00:00.000000Z',
        },
        {
          ml_service_id: '22222222-2222-2222-2222-222222222222',
          name: 'retention',
          service_status: 'training',
          last_service_run_status: 'completed',
          last_prediction_at: '2026-09-22T14:12:05.123456Z',
          next_prediction_date: '2026-09-26T00:00:00.000000Z',
        },
      ],
    };

    it('обученный сервис с идущим первым расчетом — generating, иконка «готов»', () => {
      const [card] = mapProductToIntegrations(vipIntelligence, options);

      expect(card).toMatchObject({
        status: 'generating',
        isTraining: false,
        serviceState: 'ready',
        nextCalculation: '25 сент, 2026',
        lastCalculation: null,
      });
    });

    it('переобучение с готовым результатом — результат ready, иконка «идет обучение»', () => {
      const [, card] = mapProductToIntegrations(vipIntelligence, options);

      expect(card).toMatchObject({
        status: 'ready',
        serviceState: 'training',
        tooltipIcon: 'has-been-validated',
        nextCalculation: '26 сент, 2026',
        lastCalculation: '22 сент, 2026',
      });
    });
  });
});
