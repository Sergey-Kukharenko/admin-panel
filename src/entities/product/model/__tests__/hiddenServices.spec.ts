import { describe, expect, it } from 'vitest';

import type { Product } from '../api';
import { withoutHiddenServices } from '../hiddenServices';

const service = (name: string) => ({
  ml_service_id: name,
  name,
  service_status: 'active',
  last_service_run_status: null,
  last_prediction_at: null,
  next_prediction_date: '2026-10-01T00:00:00Z',
});

describe('withoutHiddenServices', () => {
  it('из моделей PreVIP остается только Early VIP Detection (micoformer)', () => {
    const product: Product = {
      product_id: 'pi',
      name: 'player-intelligence',
      product_status: 'active',
      last_product_run_status: null,
      last_prediction_at: null,
      next_prediction_date: '2026-10-01T00:00:00Z',
      services: [
        service('previp-detection_3'),
        service('previp-detection_5'),
        service('previp-detection_7'),
        service('previp-detection_micoformer'),
        service('vip-churn'),
      ],
    };

    const [visible] = withoutHiddenServices([product]);

    expect(visible?.services.map((s) => s.name)).toEqual([
      'previp-detection_micoformer',
      'vip-churn',
    ]);
  });
});
