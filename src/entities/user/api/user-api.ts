import { apiClient } from '@/shared/api';

export const userApi = {
  /** Запросить письмо смены пароля (ссылка восстановления Authentik через SES) */
  requestPasswordChange() {
    return apiClient.post<void>('/user/password-change');
  },
};
