import { apiClient } from '@/shared/api';

import type { Invitation, InvitationCreateRequest } from './types';

export const invitationApi = {
  /** Создать отложенное приглашение и отправить письмо */
  createInvitation(payload: InvitationCreateRequest) {
    return apiClient.post<Invitation>('/registration/invitations', payload);
  },
};
