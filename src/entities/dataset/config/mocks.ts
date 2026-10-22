import type { DataVolumeChartResponse } from '../api/types';

// Mocks of GET /dashboard/charts/data-volume until WT-322 connects the API. The shape is the RFC
// contract (RFC Ph-1 Dashboard, 4.2): 31 dense days (the last 30 calendar days, inclusive)

const MOCK_DAYS = [
  '2026-05-13',
  '2026-05-14',
  '2026-05-15',
  '2026-05-16',
  '2026-05-17',
  '2026-05-18',
  '2026-05-19',
  '2026-05-20',
  '2026-05-21',
  '2026-05-22',
  '2026-05-23',
  '2026-05-24',
  '2026-05-25',
  '2026-05-26',
  '2026-05-27',
  '2026-05-28',
  '2026-05-29',
  '2026-05-30',
  '2026-05-31',
  '2026-06-01',
  '2026-06-02',
  '2026-06-03',
  '2026-06-04',
  '2026-06-05',
  '2026-06-06',
  '2026-06-07',
  '2026-06-08',
  '2026-06-09',
  '2026-06-10',
  '2026-06-11',
  '2026-06-12',
];

/** Rows per day of one data type; 0 — nothing was uploaded that day */
const MOCK_VALUES: Record<string, number[]> = {
  bets: [
    42000, 51000, 30000, 38000, 21000, 49000, 36000, 52000, 52000, 0, 51000, 52000, 27000, 6000,
    44000, 39000, 0, 48000, 33000, 45000, 41000, 50000, 37000, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  users: [
    31000, 38000, 24000, 29000, 17000, 36000, 28000, 39000, 39000, 0, 38000, 39000, 21000, 5000,
    33000, 30000, 0, 36000, 25000, 34000, 31000, 37000, 28000, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  'bets-daily': [
    24000, 29000, 18000, 22000, 13000, 28000, 21000, 30000, 30000, 0, 29000, 30000, 16000, 4000,
    25000, 23000, 0, 28000, 19000, 26000, 24000, 29000, 21000, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  'balance-daily': [
    16000, 19000, 12000, 15000, 9000, 18000, 14000, 20000, 20000, 0, 19000, 20000, 11000, 3000,
    17000, 15000, 0, 18000, 13000, 17000, 16000, 19000, 14000, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  payments: [
    9000, 11000, 7000, 9000, 5000, 11000, 8000, 12000, 12000, 0, 11000, 12000, 6000, 2000, 10000,
    9000, 0, 11000, 8000, 10000, 9000, 11000, 8000, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  'vip-users': [
    6000, 7000, 4000, 5000, 3000, 7000, 5000, 7000, 7000, 0, 7000, 7000, 4000, 1000, 6000, 5000, 0,
    7000, 5000, 6000, 6000, 7000, 5000, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
};

const MOCK_DATASET_TYPES = [
  { dataset_type_id: '3f1c2c6e-8a5d-4b7b-9a1e-2f0d6c1e9b11', name: 'bets' },
  { dataset_type_id: '7a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d', name: 'users' },
  { dataset_type_id: '1b2c3d4e-5f60-4718-8a9b-0c1d2e3f4a5b', name: 'bets-daily' },
  { dataset_type_id: '2c3d4e5f-6071-4829-9bac-1d2e3f4a5b6c', name: 'balance-daily' },
  { dataset_type_id: '3d4e5f60-7182-493a-acbd-2e3f4a5b6c7d', name: 'payments' },
  { dataset_type_id: '4e5f6071-8293-4a4b-bdce-3f4a5b6c7d8e', name: 'vip-users' },
];

const MOCK_SERIES = MOCK_DATASET_TYPES.map(({ name }) => ({
  series_key: name,
  points: MOCK_DAYS.map((date, index) => ({ date, value: MOCK_VALUES[name]?.[index] ?? 0 })),
}));

/** Response without a filter: every data type of the period */
export const MOCK_DATA_VOLUME_CHART: DataVolumeChartResponse = {
  chart_name: 'data-volume',
  period: { start_date: '2026-05-13', end_date: '2026-06-12', granularity: 'day' },
  summary: {
    total_value: MOCK_SERIES.reduce(
      (sum, series) => sum + series.points.reduce((acc, point) => acc + point.value, 0),
      0,
    ),
  },
  filters: { dataset_types: MOCK_DATASET_TYPES },
  series: MOCK_SERIES,
  has_data: true,
};
