import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import { integrationRequestApi } from '../api/integration-request-api';
import type {
  IntegrationRequestState,
  IntegrationStatus,
  ProjectApiCredential,
  ProjectApiCredentialsOverview,
  RestApiConnectionRequest,
  S3ConnectionRequest,
} from '../api/types';
import { integrationKeys } from './queryKeys';
import type { IntegrationType } from './types';

// The request is moved to «Подключено» manually on the backend and there is no push channel:
// while it is in setup, the status is refetched every minute (WT-356).
// Background tabs are not polled (refetchIntervalInBackground defaults to false)
export const INTEGRATION_STATUS_POLLING_INTERVAL = 60_000;

const OVERVIEW_FETCHERS: Record<
  IntegrationType,
  () => Promise<{ data: IntegrationRequestState | ProjectApiCredentialsOverview }>
> = {
  'rest-api': integrationRequestApi.getRestApiState,
  s3: integrationRequestApi.getS3State,
};

/**
 * One query per integration for GET /project-*-credentials: the status and the REST credentials
 * come from the same response, so every consumer subscribes to this query via `select`
 */
function useIntegrationOverview<T>(
  type: MaybeRefOrGetter<IntegrationType>,
  select: (overview: IntegrationRequestState | ProjectApiCredentialsOverview) => T,
) {
  return useQuery({
    queryKey: computed(() => integrationKeys.overview(toValue(type))),
    queryFn: async () => {
      const response = await OVERVIEW_FETCHERS[toValue(type)]();
      return response.data;
    },
    select,
    // PRD: the status is requested every time the page is opened, and refreshed on tab focus
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchInterval: (query) =>
      query.state.data?.status === 'setup_in_progress'
        ? INTEGRATION_STATUS_POLLING_INTERVAL
        : false,
  });
}

/** Connection request status */
export function useIntegrationStatus(type: MaybeRefOrGetter<IntegrationType>) {
  return useIntegrationOverview(type, (overview): IntegrationStatus => overview.status);
}

/** REST API credentials of the project: client_id per environment (WT-357) */
export function useRestApiCredentials() {
  return useIntegrationOverview(
    'rest-api',
    (overview): ProjectApiCredential[] => ('items' in overview ? overview.items : undefined) ?? [],
  );
}

export type IntegrationConnectionRequest =
  | { type: 'rest-api'; payload: RestApiConnectionRequest }
  | { type: 's3'; payload: S3ConnectionRequest };

/** Submits a connection request; on success the card shows «Настройка» without waiting for a refetch */
export function useRequestIntegrationConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: IntegrationConnectionRequest) => {
      const response =
        request.type === 'rest-api'
          ? await integrationRequestApi.requestRestApi(request.payload)
          : await integrationRequestApi.requestS3(request.payload);
      return response.data;
    },
    onSuccess: (data, request) => {
      queryClient.setQueryData<IntegrationRequestState>(
        integrationKeys.overview(request.type),
        (overview) => ({
          integration_request_id: data.integration_request_id,
          requested_at: data.created_at,
          connected_at: null,
          ...overview,
          status: data.status,
        }),
      );
    },
  });
}
