import { apiClient } from '@/shared/api';

import type { Invitation, InvitationCreateRequest } from '../model/api';

export const invitationApi = {
  /** Создать отложенное приглашение и отправить письмо */
  createInvitation(payload: InvitationCreateRequest) {
    return apiClient.post<Invitation>('/registration/invitations', payload);
  },
};
