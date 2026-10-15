import { useMutation, useQueryClient } from '@tanstack/vue-query';

import type { RestApiConnectionRequest, S3ConnectionRequest } from '@/entities/integration';
import { integrationRequestApi, integrationStatusQueryKey } from '@/entities/integration';

export type IntegrationConnectionRequest =
  | { type: 'rest-api'; payload: RestApiConnectionRequest }
  | { type: 's3'; payload: S3ConnectionRequest };

/** Отправка заявки; после успеха карточка сразу показывает «Настройка», не дожидаясь перезапроса */
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
      queryClient.setQueryData(integrationStatusQueryKey(request.type), data.status);
    },
  });
}
