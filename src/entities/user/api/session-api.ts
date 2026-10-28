import { apiClient } from '@/shared/api';

import type { UserProfile } from './types';

export const sessionApi = {
  me() {
    return apiClient.get<UserProfile>('/user/me');
  },
};
