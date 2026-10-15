import { describe, expect, it } from 'vitest';

import { i18n } from '@/shared/i18n';

import { filterVisibleDatasetTemplates, toDatasetTemplate } from '../templateMapper';

describe('toDatasetTemplate', () => {
  it('maps a known dataset type to its title, translated description and icon', () => {
    const template = toDatasetTemplate({ dataset_type_id: 't1', name: 'vip_users' });

    expect(template).toMatchObject({ id: 't1', title: 'Vip-users', icon: 'vip' });
    expect(template.description).toBe(i18n.global.t('datasets.templates.vip_users.description'));
    expect(template.description).not.toBe('datasets.templates.vip_users.description');
  });

  it('falls back to the system name for an unknown type', () => {
    expect(toDatasetTemplate({ dataset_type_id: 't2', name: 'brand_new_type' }).title).toBe(
      'brand_new_type',
    );
  });
});

describe('filterVisibleDatasetTemplates', () => {
  it('drops dataset types disabled on the backend', () => {
    expect(
      filterVisibleDatasetTemplates([{ name: 'users' }, { name: 'bets_daily' }]).map((t) => t.name),
    ).toEqual(['users']);
  });
});
