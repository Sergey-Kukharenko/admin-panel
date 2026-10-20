// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';

import AppIconButton from '../AppIconButton.vue';

const render = (attrs: Record<string, unknown> = {}) =>
  mount(AppIconButton, { attrs, slots: { default: () => h('svg', { class: 'icon' }) } });

describe('AppIconButton', () => {
  it('Top Bar icon button: 32px, radius 12, hover and focus fill, focus ring (Figma 52:2712)', () => {
    const classes = render().get('button').classes();

    expect(classes).toEqual(
      expect.arrayContaining([
        'size-8',
        'rounded-(--radius-xl)',
        'hover:bg-(--bg-button-secondary)',
        'focus-visible:bg-(--bg-button-secondary)',
        'focus-visible:shadow-(--shadow-focus)',
      ]),
    );
  });

  it('fades the whole content as one group to 70%, as in the mockup', () => {
    const group = render().get('button > span');

    expect(group.classes()).toContain('opacity-70');
    expect(group.find('svg.icon').exists()).toBe(true);
  });

  it('passes attributes to the button (aria-label, radix trigger attrs)', () => {
    const button = render({ 'aria-label': 'Помощь', 'data-state': 'open' }).get('button');

    expect(button.attributes('aria-label')).toBe('Помощь');
    expect(button.attributes('data-state')).toBe('open');
    expect(button.attributes('type')).toBe('button');
  });
});
