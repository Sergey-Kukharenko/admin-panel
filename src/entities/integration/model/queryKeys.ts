import type { IntegrationType } from './types';

export const integrationKeys = {
  all: ['integrations'] as const,
  /** GET /project-api-credentials | GET /project-s3-credentials: request status (+ REST credentials) */
  overview: (type: IntegrationType) => [...integrationKeys.all, type, 'overview'] as const,
  /** GET /project-api-credentials/{id}/logs */
  credentialLogs: (credentialId: string, page: number) =>
    [...integrationKeys.all, 'rest-api', 'credential-logs', credentialId, page] as const,
};
