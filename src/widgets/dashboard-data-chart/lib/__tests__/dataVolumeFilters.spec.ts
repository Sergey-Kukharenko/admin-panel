import { describe, expect, it } from 'vitest';

import { toDataVolumeFilters } from '../dataVolumeFilters';

describe('toDataVolumeFilters', () => {
  it('sends a UUID as the data type filter', () => {
    expect(toDataVolumeFilters('0b6b7f4e-9c1a-4d3e-8f2a-1c2d3e4f5a6b')).toEqual({
      dataset_type_id__in: '0b6b7f4e-9c1a-4d3e-8f2a-1c2d3e4f5a6b',
    });
  });

  it.each(['', 'bets', '123', '0b6b7f4e-9c1a-4d3e-8f2a', '0b6b7f4e-9c1a-4d3e-8f2a-1c2d3e4f5a6bX'])(
    'requests all types for %j, which the backend would reject with 422',
    (dataTypeId) => {
      expect(toDataVolumeFilters(dataTypeId)).toEqual({});
    },
  );
});
