import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import { projectApiCredentialApi } from '../api/project-api-credential-api';
import { integrationKeys } from './queryKeys';

export const API_CREDENTIAL_LOGS_PAGE_SIZE = 20;

/** Token-issuance log of a REST API credential; fetched only while `enabled` (the log is open) */
export function useApiCredentialLogs(options: {
  credentialId: MaybeRefOrGetter<string>;
  page: MaybeRefOrGetter<number>;
  enabled: MaybeRefOrGetter<boolean>;
}) {
  return useQuery({
    queryKey: computed(() =>
      integrationKeys.credentialLogs(toValue(options.credentialId), toValue(options.page)),
    ),
    queryFn: async ({ signal }) => {
      const response = await projectApiCredentialApi.getLogs(
        toValue(options.credentialId),
        { page: toValue(options.page), page_size: API_CREDENTIAL_LOGS_PAGE_SIZE },
        signal,
      );
      return response.data;
    },
    enabled: computed(() => toValue(options.enabled)),
    placeholderData: keepPreviousData,
  });
}
