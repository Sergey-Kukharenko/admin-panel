// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';

import type { AppCheckboxProps } from '../AppCheckbox.types';
import AppCheckbox from '../AppCheckbox.vue';

function render(props: AppCheckboxProps = {}) {
  return mount(AppCheckbox, { props, slots: { default: 'bets' }, attachTo: document.body });
}

const box = (wrapper: ReturnType<typeof render>) => wrapper.get('button[role="checkbox"]');

describe('AppCheckbox', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it.each([
    [true, 'true'],
    [false, 'false'],
  ])('checked=%s is announced as aria-checked=%s', (modelValue, ariaChecked) => {
    expect(box(render({ modelValue })).attributes('aria-checked')).toBe(ariaChecked);
  });

  it('a click on the box emits the opposite value; the label is the slot', async () => {
    const wrapper = render({ modelValue: true });

    await box(wrapper).trigger('click');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(wrapper.text()).toBe('bets');
  });

  it('disabled: no change on click', async () => {
    const wrapper = render({ modelValue: false, disabled: true });

    await box(wrapper).trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('color replaces the bg/accent fill of the checked box (UI kit Legend Item 52:3438)', () => {
    expect(
      box(render({ modelValue: true, color: 'var(--stats-users)' })).attributes('style'),
    ).toContain('--app-checkbox-checked: var(--stats-users)');
    expect(box(render({ modelValue: true })).attributes('style')).toBeUndefined();
  });
});
