import type { UserProfile } from '@/entities/user';

import { apiClient } from './api-client';

export const sessionApi = {
  me() {
    return apiClient.get<UserProfile>('/user/me');
  },
};
