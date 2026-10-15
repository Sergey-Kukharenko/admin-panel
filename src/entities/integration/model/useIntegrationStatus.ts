import { useQuery } from '@tanstack/vue-query';
import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import { integrationRequestApi } from '../api/integration-request-api';
import type { IntegrationStatus, IntegrationType } from './types';

export const integrationStatusQueryKey = (type: IntegrationType) =>
  ['integrations', type, 'status'] as const;

// В «Подключено» заявку переводят вручную на стороне бэкенда, push-канала нет —
// пока заявка в настройке, перезапрашиваем статус раз в минуту (WT-356).
// Фоновая вкладка не опрашивается (refetchIntervalInBackground по умолчанию false)
export const INTEGRATION_STATUS_POLLING_INTERVAL = 60_000;

const STATE_FETCHERS = {
  'rest-api': integrationRequestApi.getRestApiState,
  s3: integrationRequestApi.getS3State,
} satisfies Record<IntegrationType, unknown>;

/** Статус заявки на подключение; по PRD запрашивается при каждом открытии страницы */
export function useIntegrationStatus(type: MaybeRefOrGetter<IntegrationType>) {
  return useQuery({
    queryKey: computed(() => integrationStatusQueryKey(toValue(type))),
    queryFn: async (): Promise<IntegrationStatus> => {
      const response = await STATE_FETCHERS[toValue(type)]();
      return response.data.status;
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchInterval: (query) =>
      query.state.data === 'setup_in_progress' ? INTEGRATION_STATUS_POLLING_INTERVAL : false,
  });
}
