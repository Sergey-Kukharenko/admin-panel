import { describe, expect, it } from 'vitest';

import { mapCredentialsToRows } from '../credentialRows';

const credential = (environment: 'dev' | 'prod', clientId: string) => ({
  project_api_credential_id: `${environment}-id`,
  client_id: clientId,
  environment,
  scopes: [],
});

describe('mapCredentialsToRows', () => {
  it('returns one row per environment, Production first', () => {
    expect(
      mapCredentialsToRows([credential('dev', 'cid_dev'), credential('prod', 'cid_prod')]),
    ).toEqual([
      { id: 'prod-id', environmentLabel: 'Production', clientId: 'cid_prod' },
      { id: 'dev-id', environmentLabel: 'Development', clientId: 'cid_dev' },
    ]);
  });

  it('returns a single row when only one environment is issued', () => {
    expect(mapCredentialsToRows([credential('prod', 'cid_prod')])).toEqual([
      { id: 'prod-id', environmentLabel: 'Production', clientId: 'cid_prod' },
    ]);
  });

  it('returns no rows when no credentials are issued yet', () => {
    expect(mapCredentialsToRows([])).toEqual([]);
  });
});
