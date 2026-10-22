// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';

import { i18n, setAppLocale } from '@/shared/i18n';
import type { IconName } from '@/shared/ui/app-icon';

import type { AppStatusBadgeStatus } from '../AppStatusBadge.types';
import AppStatusBadge from '../AppStatusBadge.vue';

function render(props: { status: AppStatusBadgeStatus; label?: string; icon?: IconName | null }) {
  return mount(AppStatusBadge, { props, global: { plugins: [i18n] } });
}

const iconOf = (wrapper: ReturnType<typeof render>) => wrapper.get('svg').html();

describe('AppStatusBadge', () => {
  afterEach(() => setAppLocale('ru'));

  // Figma StatusBadge (UI kit): fill and text color per tone
  it.each([
    ['neutral', 'bg-(--bg-badge-neutral)', 'text-(--text-primary)', 'progress-2-line'],
    ['loading', 'bg-(--bg-badge-loading)', 'text-(--icon-loading)', 'loader-2-line'],
    ['success', 'bg-(--bg-badge-success)', 'text-(--text-success-alt)', 'checkbox-circle-line'],
    ['error', 'bg-(--bg-danger)', 'text-(--text-error)', 'close-circle-line'],
  ] as const)('%s tone: fill, text color and icon', (status, bg, color, icon) => {
    const wrapper = render({ status });

    expect(wrapper.classes()).toEqual(expect.arrayContaining([bg, color]));
    expect(iconOf(wrapper)).toContain(icon);
  });

  it.each(['ru', 'en'] as const)('shows the translated default label (%s)', (locale) => {
    setAppLocale(locale);

    expect(render({ status: 'error' }).text()).toBe(i18n.global.t('common.statusBadge.error'));
  });

  it('label and icon props replace the defaults', () => {
    const wrapper = render({ status: 'neutral', label: 'Generating', icon: 'loader-2-line' });

    expect(wrapper.text()).toBe('Generating');
    expect(iconOf(wrapper)).toContain('loader-2-line');
  });

  // A still loader reads as a hung page: results "Generating" is a neutral badge with the loader
  it.each([
    [{ status: 'loading' }, true],
    [{ status: 'neutral', icon: 'loader-2-line' }, true],
    [{ status: 'neutral' }, false],
    [{ status: 'success' }, false],
  ] as const)('%j: the icon spins — %s', (props, spins) => {
    expect(render(props).get('svg').classes().includes('animate-spin')).toBe(spins);
  });

  it('icon null: no icon, the text keeps the 8px left inset (dashboard period badge 1322:142118)', () => {
    const wrapper = render({ status: 'neutral', label: 'за 30 дней', icon: null });

    expect(wrapper.find('svg').exists()).toBe(false);
    expect(wrapper.classes()).toContain('pl-2');
    expect(wrapper.classes()).not.toContain('pl-1.5');
    expect(wrapper.text()).toBe('за 30 дней');
  });
});
