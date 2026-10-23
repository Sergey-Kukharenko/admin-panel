import { listDays } from '@/shared/lib/chart';

import type { ProductChartResponse } from '../api/types';
import type { ProductStatusSummary } from '../model/types';

// Mock of the main dashboard mockup state (Figma «Много данных» 1361:147608) until the API exists:
// the Ph-1 dashboard RFC does not cover product statuses yet (WT-322). Order and slugs as in /products
export const MOCK_PRODUCT_STATUS_SUMMARIES: ProductStatusSummary[] = [
  {
    productSlug: 'game-recommender',
    isAvailable: true,
    productStatus: 'active',
    dataStatus: 'validated',
    resultStatus: 'ready',
  },
  {
    productSlug: 'player-intelligence',
    isAvailable: true,
    productStatus: 'active',
    dataStatus: 'validated',
    resultStatus: 'ready',
  },
];

// Mocks of GET /dashboard/charts/{product} until WT-322 connects the API, in the RFC shape
// (RFC Ph-1 Dashboard, 4.3–4.4): 31 dense days, one series per active ML service of the product.
// The values follow the mockup scale (Figma «Много данных» 1361:147750): RS up to ~340, PI up to
// ~130k

const MOCK_CHART_PERIOD: ProductChartResponse['period'] = {
  start_date: '2026-05-13',
  end_date: '2026-06-12',
  granularity: 'day',
};

function mockSeries(valuesByService: Record<string, number[]>) {
  const days = listDays(MOCK_CHART_PERIOD.start_date, MOCK_CHART_PERIOD.end_date);
  return Object.entries(valuesByService).map(([seriesKey, values]) => ({
    series_key: seriesKey,
    points: days.map((date, index) => ({ date, value: values[index] ?? 0 })),
  }));
}

function mockChart(
  chartName: ProductChartResponse['chart_name'],
  valuesByService: Record<string, number[]>,
): ProductChartResponse {
  const series = mockSeries(valuesByService);
  const total = series.reduce(
    (sum, item) => sum + item.points.reduce((acc, point) => acc + point.value, 0),
    0,
  );

  return {
    chart_name: chartName,
    period: MOCK_CHART_PERIOD,
    summary: { total_value: total },
    filters: null,
    series,
    has_data: total > 0,
  };
}

/**
 * Chart of every product connected to the project, by product slug; a product without an entry is
 * not connected (the API answers 404)
 */
export const MOCK_PRODUCT_CHARTS: Record<string, ProductChartResponse> = {
  'game-recommender': mockChart('game-recommender', {
    main: [
      180, 120, 160, 210, 240, 230, 190, 150, 130, 170, 230, 200, 150, 140, 130, 170, 220, 240, 210,
      180, 160, 150, 140, 170, 210, 250, 230, 190, 170, 160, 150,
    ],
    new_for_user: [
      280, 230, 210, 260, 300, 340, 330, 310, 270, 250, 240, 230, 260, 300, 330, 340, 310, 280, 260,
      250, 240, 230, 250, 280, 320, 340, 300, 270, 250, 240, 245,
    ],
    similar_to_user_top_games: [
      310, 290, 270, 210, 150, 160, 190, 230, 270, 280, 260, 240, 250, 290, 320, 300, 270, 250, 240,
      235, 230, 225, 220, 200, 170, 150, 160, 180, 190, 190, 185,
    ],
    similar: [
      90, 80, 70, 85, 100, 110, 105, 95, 90, 85, 80, 90, 100, 115, 120, 110, 100, 95, 90, 85, 80,
      85, 95, 105, 110, 100, 95, 90, 85, 80, 75,
    ],
  }),
  'player-intelligence': mockChart('player-intelligence', {
    'previp-detection_micoformer': [
      68000, 52000, 41000, 55000, 69000, 82000, 94000, 93000, 91000, 75000, 60000, 51000, 49000,
      62000, 80000, 93000, 82000, 70000, 59000, 56000, 54000, 53000, 61000, 78000, 95000, 82000,
      66000, 58000, 56000, 55000, 54000,
    ],
    'vip-churn': [
      122000, 115000, 106000, 80000, 57000, 66000, 77000, 95000, 110000, 104000, 97000, 112000,
      131000, 120000, 104000, 99000, 95000, 92000, 90000, 75000, 57000, 62000, 70000, 75000, 76000,
      74000, 73000, 72000, 74000, 75000, 75000,
    ],
    'stable-vip-prediction': [
      30000, 28000, 26000, 27000, 29000, 31000, 33000, 32000, 30000, 29000, 28000, 29000, 31000,
      33000, 34000, 33000, 31000, 30000, 29000, 28000, 27000, 28000, 30000, 32000, 33000, 32000,
      31000, 30000, 29000, 28000, 28000,
    ],
    'vip-segment-prediction': [
      15000, 16000, 17000, 16000, 15000, 14000, 15000, 16000, 18000, 19000, 18000, 17000, 16000,
      15000, 14000, 15000, 16000, 17000, 18000, 17000, 16000, 15000, 14000, 15000, 16000, 17000,
      18000, 17000, 16000, 15000, 15000,
    ],
  }),
};
