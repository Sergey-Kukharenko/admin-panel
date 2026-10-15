import { apiClient } from '@/shared/api';

import type { UserProfile } from '../model/types';


export const sessionApi = {
  me() {
    return apiClient.get<UserProfile>('/user/me');
  },
};
