import { describe, expect, it } from 'vitest';

import {
  buildRestApiConnectionRequest,
  buildS3ConnectionRequest,
  isRestApiConnectionFormValid,
  isValidIpv4,
  MAX_IP_ADDRESSES,
} from '../connectionRequest';

describe('isValidIpv4', () => {
  it.each(['192.168.1.1', '10.0.0.5', '0.0.0.0', '255.255.255.255', ' 8.8.8.8 '])(
    'accepts %s',
    (ip) => expect(isValidIpv4(ip)).toBe(true),
  );

  it.each(['', '256.1.1.1', '1.2.3', '1.2.3.4.5', '01.2.3.4', 'a.b.c.d', '1.2.3.4/24', '::1'])(
    'rejects %s',
    (ip) => expect(isValidIpv4(ip)).toBe(false),
  );
});

describe('isRestApiConnectionFormValid', () => {
  it('public access needs no IP addresses', () => {
    expect(isRestApiConnectionFormValid({ accessType: 'public', ipAddresses: [''] })).toBe(true);
  });

  it('ip_restricted needs at least one IP address', () => {
    expect(
      isRestApiConnectionFormValid({ accessType: 'ip_restricted', ipAddresses: ['', ' '] }),
    ).toBe(false);
  });

  it('ip_restricted ignores empty rows but rejects invalid ones', () => {
    expect(
      isRestApiConnectionFormValid({ accessType: 'ip_restricted', ipAddresses: ['10.0.0.1', ''] }),
    ).toBe(true);
    expect(
      isRestApiConnectionFormValid({ accessType: 'ip_restricted', ipAddresses: ['10.0.0.1', 'x'] }),
    ).toBe(false);
  });

  it(`ip_restricted allows at most ${MAX_IP_ADDRESSES} addresses`, () => {
    const ips = Array.from({ length: MAX_IP_ADDRESSES + 1 }, (_, index) => `10.0.0.${index}`);
    expect(isRestApiConnectionFormValid({ accessType: 'ip_restricted', ipAddresses: ips })).toBe(
      false,
    );
  });
});

describe('buildRestApiConnectionRequest', () => {
  it('maps the form to the RFC request body', () => {
    expect(
      buildRestApiConnectionRequest({
        accessType: 'ip_restricted',
        ipAddresses: [' 10.0.0.1 ', '', '10.0.0.1', '10.0.0.2'],
        environment: 'production',
      }),
    ).toEqual({
      access_type: 'ip_restricted',
      ip_addresses: ['10.0.0.1', '10.0.0.2'],
      environments: ['prod'],
    });
  });

  it('sends an empty IP list for public access', () => {
    expect(
      buildRestApiConnectionRequest({
        accessType: 'public',
        ipAddresses: ['10.0.0.1'],
        environment: 'development',
      }),
    ).toEqual({ access_type: 'public', ip_addresses: [], environments: ['dev'] });
  });
});

describe('buildS3ConnectionRequest', () => {
  it('maps the environment to the RFC request body', () => {
    expect(buildS3ConnectionRequest({ environment: 'production' })).toEqual({
      environments: ['prod'],
    });
    expect(buildS3ConnectionRequest({ environment: 'development' })).toEqual({
      environments: ['dev'],
    });
  });
});
