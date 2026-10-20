import type { IntegrationType } from './types';

export const integrationKeys = {
  all: ['integrations'] as const,
  /** GET /project-api-credentials | GET /project-s3-credentials: request status (+ REST credentials) */
  overview: (type: IntegrationType) => [...integrationKeys.all, type, 'overview'] as const,
};
