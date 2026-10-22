import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { integrationKeys, projectApiCredentialApi } from '@/entities/integration';

/**
 * Issues a new client_secret for a REST API credential (POST /{id}/rotate-secret).
 * The previous secret stops working immediately; the new one is returned only once
 */
export function useRotateApiSecret() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentialId: string) => {
      const response = await projectApiCredentialApi.rotateSecret(credentialId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationKeys.overview('rest-api') });
    },
  });
}
