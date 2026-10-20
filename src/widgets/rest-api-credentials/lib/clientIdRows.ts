import type { CredentialsInfoRow, ProjectApiCredential } from '@/entities/integration';

const ENVIRONMENT_ORDER = ['prod', 'dev'] as const;

// Technical environment names are not translated (same as the Production/Development tabs)
const ENVIRONMENT_LABELS: Record<(typeof ENVIRONMENT_ORDER)[number], string> = {
  prod: 'Production',
  dev: 'Development',
};

/**
 * The backend issues one credential per environment (GET /project-api-credentials → items),
 * while the mockup has a single client_id row — show one row per environment, Production first.
 * No credentials yet → a single non-copyable «—» row
 */
export function mapCredentialsToClientIdRows(
  credentials: ProjectApiCredential[],
): CredentialsInfoRow[] {
  const rows = ENVIRONMENT_ORDER.flatMap((environment) =>
    credentials
      .filter((credential) => credential.environment === environment)
      .map((credential) => ({
        label: `client_id (${ENVIRONMENT_LABELS[environment]})`,
        value: credential.client_id,
        copyable: true,
      })),
  );

  return rows.length > 0 ? rows : [{ label: 'client_id', value: '—', copyable: false }];
}
