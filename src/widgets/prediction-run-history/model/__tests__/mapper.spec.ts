import { describe, expect, it } from 'vitest';

import type { MLServiceRunListItem } from '@/entities/product';

import { mapServiceRunToRunRecord } from '../mapper';

const resolvers = {
  productName: (slug: string) => `product:${slug}`,
  serviceName: (slug: string) => `service:${slug}`,
};

const baseRun: MLServiceRunListItem = {
  ml_service_run_id: 'run-1',
  product_run_id: 'product-run-1',
  product_id: 'caef651a-5af9-4330-b087-55a144e0abc6',
  product_name: 'player-intelligence',
  ml_service_id: '9a54bebd-835b-4f5b-bef5-9f6763f86615',
  ml_service_name: 'previp-detection_3',
  status: 'completed',
  service_version: null,
  started_at: '2026-09-23T17:28:13.456590Z',
  finished_at: '2026-09-23T17:40:00.000000Z',
  error_status_message: null,
  total_predictions: 108,
  prediction_result_id: 'dad20ea5-d3a1-4dcc-a44f-6e0bd7dbe281',
  is_downloadable: true,
  created_at: '2026-09-23T17:28:13.456590Z',
};

describe('mapServiceRunToRunRecord', () => {
  it('готовый прогон с файлом — Ready и кнопка CSV, ID колонки — общий product_run_id', () => {
    expect(mapServiceRunToRunRecord(baseRun, resolvers)).toMatchObject({
      id: 'run-1',
      runId: 'product-run-1',
      predictionResultId: 'dad20ea5-d3a1-4dcc-a44f-6e0bd7dbe281',
      product: 'product:player-intelligence',
      service: 'service:previp-detection_3',
      status: 'ready',
      resultType: 'csv',
    });
  });

  it('processing — Generating без кнопки результата', () => {
    const record = mapServiceRunToRunRecord(
      { ...baseRun, status: 'processing', finished_at: null, is_downloadable: false },
      resolvers,
    );

    expect(record).toMatchObject({ status: 'generating', resultType: null });
  });

  it('error — Failed без кнопки результата', () => {
    const record = mapServiceRunToRunRecord(
      { ...baseRun, status: 'error', prediction_result_id: null, is_downloadable: false },
      resolvers,
    );

    expect(record).toMatchObject({ status: 'failed', resultType: null });
  });

  it('completed, но файл еще не готов — Ready без кнопки (данные со стенда)', () => {
    const record = mapServiceRunToRunRecord(
      { ...baseRun, finished_at: null, is_downloadable: false },
      resolvers,
    );

    expect(record).toMatchObject({ status: 'ready', resultType: null });
  });

  it('продукт рекомендаций отдает результат через API', () => {
    const record = mapServiceRunToRunRecord(
      { ...baseRun, product_name: 'game-recommender', ml_service_name: 'similar' },
      resolvers,
    );

    expect(record.resultType).toBe('api');
  });
});
