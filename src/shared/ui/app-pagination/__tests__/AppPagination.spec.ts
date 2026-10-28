import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { i18n } from '@/shared/i18n';

import AppPagination from '../AppPagination.vue';

function mountPagination(page: number, totalItems: number, pageSize = 10) {
  return mount(AppPagination, {
    props: { page, totalItems, pageSize },
    global: { plugins: [i18n] },
  });
}

const pageButtons = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('button').filter((button) => !button.attributes('aria-label'));

describe('AppPagination', () => {
  it('renders nothing for a single page', () => {
    expect(mountPagination(1, 10).find('nav').exists()).toBe(false);
    expect(mountPagination(1, 0).find('nav').exists()).toBe(false);
  });

  it('shows all pages and marks the current one', () => {
    const wrapper = mountPagination(2, 30);

    expect(pageButtons(wrapper).map((button) => button.text())).toEqual(['1', '2', '3']);
    expect(wrapper.find('[aria-current="page"]').text()).toBe('2');
  });

  it('hides extra pages behind an ellipsis', () => {
    const wrapper = mountPagination(10, 200);

    expect(wrapper.text()).toContain('…');
    expect(pageButtons(wrapper).length).toBeLessThan(20);
  });

  it('disables the arrows at the edges', () => {
    const first = mountPagination(1, 30);
    expect(first.get('[aria-label="Предыдущая страница"]').attributes('disabled')).toBeDefined();

    const last = mountPagination(3, 30);
    expect(last.get('[aria-label="Следующая страница"]').attributes('disabled')).toBeDefined();
  });

  it('changes the page through v-model:page', async () => {
    const wrapper = mount(AppPagination, {
      props: {
        page: 2,
        totalItems: 50,
        pageSize: 10,
        'onUpdate:page': (page: number) => wrapper.setProps({ page }),
      },
      global: { plugins: [i18n] },
    });

    await wrapper.get('[aria-label="Следующая страница"]').trigger('click');
    await wrapper.get('[aria-label="Предыдущая страница"]').trigger('click');
    await pageButtons(wrapper)
      .find((button) => button.text() === '5')!
      .trigger('click');

    expect(wrapper.emitted('update:page')).toEqual([[3], [2], [5]]);
    expect(wrapper.get('[aria-current="page"]').text()).toBe('5');
  });
});
