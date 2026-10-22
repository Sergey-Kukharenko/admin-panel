import type { ProjectApiCredential } from '@/entities/integration';

import type { ApiCredentialRow } from '../model/types';

const ENVIRONMENT_ORDER = ['prod', 'dev'] as const;

// Technical environment names are not translated (same as the Production/Development tabs)
const ENVIRONMENT_LABELS: Record<(typeof ENVIRONMENT_ORDER)[number], string> = {
  prod: 'Production',
  dev: 'Development',
};

/**
 * The backend issues one credential per environment (GET /project-api-credentials → items):
 * one table row per environment, Production first
 */
export function mapCredentialsToRows(credentials: ProjectApiCredential[]): ApiCredentialRow[] {
  return ENVIRONMENT_ORDER.flatMap((environment) =>
    credentials
      .filter((credential) => credential.environment === environment)
      .map((credential) => ({
        id: credential.project_api_credential_id,
        environmentLabel: ENVIRONMENT_LABELS[environment],
        clientId: credential.client_id,
      })),
  );
}
