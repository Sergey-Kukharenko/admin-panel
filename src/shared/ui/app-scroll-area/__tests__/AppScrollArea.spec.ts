// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import AppScrollArea from '../AppScrollArea.vue';

describe('AppScrollArea', () => {
  it('renders the slot inside the scrollable viewport', () => {
    const wrapper = mount(AppScrollArea, { slots: { default: '<p>Row</p>' } });

    const viewport = wrapper.get('[data-radix-scroll-area-viewport]');
    expect(viewport.text()).toBe('Row');
  });

  it('applies viewportClass to the viewport (size limits come from the consumer)', () => {
    const wrapper = mount(AppScrollArea, { props: { viewportClass: 'max-h-73' } });

    expect(wrapper.get('[data-radix-scroll-area-viewport]').classes()).toContain('max-h-73');
  });

  it('root does not force a height, so the viewport limit decides it', () => {
    const wrapper = mount(AppScrollArea);

    expect(wrapper.classes()).not.toContain('h-full');
  });
});
