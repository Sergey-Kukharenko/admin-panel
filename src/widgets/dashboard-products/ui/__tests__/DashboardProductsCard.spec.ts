// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';

import { i18n, setAppLocale } from '@/shared/i18n';

import type { DashboardProductCard } from '../../model/types';
import DashboardProductsCard from '../DashboardProductsCard.vue';

const CARD: DashboardProductCard = {
  slug: 'game-recommender',
  name: 'Recommender System',
  description: 'Card description',
  image: '/illustration.png',
  isAvailable: true,
  modelTag: {
    status: 'active',
    label: 'Active',
    icon: 'check-alt',
    color: 'text-(--text-model-active)',
    highlighted: false,
  },
  dataBadge: { status: 'success', label: 'Validated' },
  resultBadge: { status: 'neutral', icon: 'loader-2-line', label: 'Generating' },
};

function render(card: Partial<DashboardProductCard> = {}) {
  return mount(DashboardProductsCard, {
    props: { card: { ...CARD, ...card } },
    global: { plugins: [i18n] },
  });
}

const highlightsOf = (wrapper: ReturnType<typeof render>) =>
  wrapper
    .findAll('span[aria-hidden="true"]')
    .filter((span) => span.classes().includes('bg-(image:--bg-model-training-highlight)'));

describe('DashboardProductsCard', () => {
  afterEach(() => setAppLocale('ru'));

  it('shows the name, the description and the illustration', () => {
    const wrapper = render();

    expect(wrapper.get('h3').text()).toBe('Recommender System');
    expect(wrapper.text()).toContain('Card description');
    expect(wrapper.get('img').attributes('src')).toBe('/illustration.png');
  });

  it('shows the model tag and the Data / Results badges (mockup 1361:147608)', () => {
    const text = render().text();

    for (const label of [
      'Active',
      i18n.global.t('dashboard.products.data'),
      'Validated',
      i18n.global.t('dashboard.products.results'),
      'Generating',
    ]) {
      expect(text).toContain(label);
    }
  });

  it.each([
    [true, 1],
    [false, 0],
  ] as const)('highlight over the tag text: %s (mockup 1322:136902)', (highlighted, count) => {
    const wrapper = render({ modelTag: { ...CARD.modelTag, highlighted } });

    expect(highlightsOf(wrapper)).toHaveLength(count);
  });

  it('no description and illustration for a product without frontend content', () => {
    const wrapper = render({ description: null, image: null });

    expect(wrapper.find('p').exists()).toBe(false);
    expect(wrapper.find('img').exists()).toBe(false);
  });

  it.each(['ru', 'en'] as const)(
    'unavailable product: muted name, lock note instead of the tag and statuses (1418:191791, %s)',
    (locale) => {
      setAppLocale(locale);
      const wrapper = render({ isAvailable: false });

      expect(wrapper.get('h3').classes()).toContain('text-(--text-tertiary)');
      expect(wrapper.text()).toContain(i18n.global.t('dashboard.products.unavailable'));
      expect(wrapper.text()).not.toContain('Active');
      expect(wrapper.text()).not.toContain('Validated');
    },
  );
});
