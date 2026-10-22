import { describe, expect, it } from 'vitest';

import { formatLogDate, mapLogItemToRecord } from '../mapper';

describe('formatLogDate', () => {
  it('formats date and time without the «г.» suffix', () => {
    expect(formatLogDate('2026-10-22T11:05:33Z', 'ru-RU')).toMatch(
      /^22 октября 2026, \d{2}:05:33$/,
    );
  });

  it('uses the given locale', () => {
    expect(formatLogDate('2026-10-22T11:05:33Z', 'en-US')).toMatch(
      /^22 October 2026, \d{2}:05:33$/,
    );
  });
});

describe('mapLogItemToRecord', () => {
  it('maps the log item to a table record', () => {
    expect(
      mapLogItemToRecord(
        { pk: 'e1', action: 'authorize_application', client_ip: '10.0.0.1', created: null },
        0,
        'ru-RU',
      ),
    ).toEqual({ id: 'e1', createdAt: '—', action: 'authorize_application', clientIp: '10.0.0.1' });
  });

  it('falls back to dashes and the row index when fields are missing', () => {
    expect(mapLogItemToRecord({}, 3, 'ru-RU')).toEqual({
      id: 'log-3',
      createdAt: '—',
      action: '—',
      clientIp: '—',
    });
  });
});
