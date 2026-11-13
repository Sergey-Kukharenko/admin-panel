import { describe, expect, it } from 'vitest';

import type { Product, ProductChartResponse } from '../../api/types';
import { withoutHiddenChartSeries, withoutHiddenServices } from '../hiddenServices';

const service = (name: string) => ({
  ml_service_id: name,
  name,
  service_status: 'active',
  last_service_run_status: null,
  last_prediction_at: null,
  next_prediction_date: '2026-10-01T00:00:00Z',
});

describe('withoutHiddenChartSeries', () => {
  const line = (key: string, values: number[]) => ({
    series_key: key,
    points: values.map((value, index) => ({ date: `2026-11-0${index + 1}`, value })),
  });
  const chart = (series: ProductChartResponse['series']): ProductChartResponse => {
    const total = series
      .flatMap((item) => item.points)
      .reduce((sum, point) => sum + point.value, 0);
    return {
      chart_name: 'player-intelligence',
      period: { start_date: '2026-11-01', end_date: '2026-11-02', granularity: 'day' },
      summary: { total_value: total },
      filters: null,
      series,
      has_data: total > 0,
    };
  };

  it('removes only the hidden variants and preserves visible order, dates and values', () => {
    const source = chart([
      line('previp-detection_3', [1000, 2000]),
      line('previp-detection_micoformer', [1, 2]),
      line('PREVIP-DETECTION_5', [3000, 4000]),
      line('vip-churn', [3, 4]),
      line('previp-detection_7', [5000, 6000]),
      line('stable-vip-prediction', [5, 6]),
      line('vip-segment-prediction', [7, 8]),
      line('future-service', [9, 10]),
    ]);
    const original = structuredClone(source);
    const result = withoutHiddenChartSeries(source);

    expect(result).toEqual({
      ...source,
      series: [
        source.series[1],
        source.series[3],
        source.series[5],
        source.series[6],
        source.series[7],
      ],
      summary: { total_value: 55 },
      has_data: true,
    });
    expect(source).toEqual(original);
  });

  it.each([{ visible: [] }, { visible: [line('vip-churn', [0, 0])] }])(
    'has no visible data when positive values belong only to hidden services ($visible)',
    ({ visible }) => {
      const result = withoutHiddenChartSeries(
        chart([line('previp-detection_3', [10, 20]), ...visible]),
      );

      expect(result).toMatchObject({
        series: visible,
        summary: { total_value: 0 },
        has_data: false,
      });
    },
  );

  it('leaves unaffected charts, including their server metadata, unchanged', () => {
    const source = chart([line('main', [1, 2]), line('similar', [3, 4])]);
    source.chart_name = 'game-recommender';
    expect(withoutHiddenChartSeries(source)).toBe(source);
    const empty = chart([]);
    expect(withoutHiddenChartSeries(empty)).toBe(empty);
    expect(withoutHiddenChartSeries(null)).toBeNull();
  });
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
