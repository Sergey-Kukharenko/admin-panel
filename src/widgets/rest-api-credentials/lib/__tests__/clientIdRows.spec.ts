import { describe, expect, it } from 'vitest';

import { mapCredentialsToClientIdRows } from '../clientIdRows';

const credential = (environment: 'dev' | 'prod', clientId: string) => ({
  project_api_credential_id: `${environment}-id`,
  client_id: clientId,
  environment,
  scopes: [],
});

describe('mapCredentialsToClientIdRows', () => {
  it('shows one row per environment, Production first', () => {
    expect(
      mapCredentialsToClientIdRows([credential('dev', 'cid_dev'), credential('prod', 'cid_prod')]),
    ).toEqual([
      { label: 'client_id (Production)', value: 'cid_prod', copyable: true },
      { label: 'client_id (Development)', value: 'cid_dev', copyable: true },
    ]);
  });

  it('shows a single row when only one environment is issued', () => {
    expect(mapCredentialsToClientIdRows([credential('prod', 'cid_prod')])).toEqual([
      { label: 'client_id (Production)', value: 'cid_prod', copyable: true },
    ]);
  });

  it('shows a non-copyable dash when there are no credentials yet', () => {
    expect(mapCredentialsToClientIdRows([])).toEqual([
      { label: 'client_id', value: '—', copyable: false },
    ]);
  });
});
