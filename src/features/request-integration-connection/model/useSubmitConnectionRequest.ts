import { useQueryClient } from '@tanstack/vue-query';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

import type { IntegrationConnectionRequest } from '@/entities/integration';
import { integrationKeys, useRequestIntegrationConnection } from '@/entities/integration';
import { getHttpStatus } from '@/shared/api';
import { ROUTE_NAMES } from '@/shared/config';

/**
 * Sends a connection request and reacts to the result:
 * - success: close the modal, toast, back to the catalog where the card shows «Настройка»
 * - 409 (an active request already exists, e.g. sent from another tab): close the modal and
 *   refetch the status — the page shows «Настройка»
 * - any other error: keep the modal open with the filled form so it can be resent
 * Texts were proposed to PM in WT-337
 */
export function useSubmitConnectionRequest(options: { onClose: () => void }) {
  const { t } = useI18n({ useScope: 'global' });
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useRequestIntegrationConnection();

  function submit(request: IntegrationConnectionRequest) {
    mutate(request, {
      onSuccess: () => {
        options.onClose();
        // PRD AC9: the success toast stays 5 seconds
        toast.success(t('integrations.detail.requestSuccess'), { duration: 5000 });
        router.push({ name: ROUTE_NAMES.integrations });
      },
      onError: (error) => {
        if (getHttpStatus(error) === 409) {
          options.onClose();
          toast.error(t('integrations.detail.requestAlreadySent'));
          queryClient.invalidateQueries({ queryKey: integrationKeys.overview(request.type) });
          return;
        }

        toast.error(t('integrations.detail.requestFailed'));
      },
    });
  }

  return { submit, isPending };
}
