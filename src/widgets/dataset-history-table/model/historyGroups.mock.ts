import type { DatasetHistoryGroup } from './types';

export const HISTORY_GROUPS_MOCK: DatasetHistoryGroup[] = [
  {
    id: 'group-1',
    date: '29 Jun 2026, 03:16',
    uploadedCount: 1,
    totalCount: 3,
    source: 'CSV',
    categories: [
      {
        id: 'users',
        title: 'Users',
        count: 2,
        files: [
          { id: '1', name: 'casino_rewards.csv', rowsCount: 7634, status: 'uploaded' },
          { id: '2', name: 'jackpot_winners.csv', rowsCount: 2345, status: 'uploaded' },
        ],
      },
      {
        id: 'vip-users',
        title: 'Vip-users',
        count: 1,
        files: [{ id: '3', name: 'vip_players_list.csv', rowsCount: 5420, status: 'processing' }],
      },
      {
        id: 'bets',
        title: 'Bets',
        count: 2,
        files: [
          { id: '4', name: 'withdrawal_requests.csv', rowsCount: 1208, status: 'processing' },
          { id: '5', name: 'bets.csv', rowsCount: 890, status: 'error' },
        ],
      },
    ],
  },
  {
    id: 'group-2',
    date: '10 Jun 2026, 09:12',
    uploadedCount: 3,
    totalCount: 3,
    source: 'CSV',
    categories: [
      {
        id: 'users',
        title: 'Users',
        count: 1,
        files: [{ id: '6', name: 'users.csv', rowsCount: 500, status: 'uploaded' }],
      },
    ],
  },
];
