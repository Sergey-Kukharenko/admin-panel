// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UserAvatar from '../UserAvatar.vue';

describe('UserAvatar', () => {
  it('is the 28px gradient circle with a decorative silhouette (Figma avatar 55:128)', () => {
    const wrapper = mount(UserAvatar);

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'size-7',
        'rounded-(--radius-full)',
        'bg-(image:--bg-avatar)',
        'overflow-hidden',
      ]),
    );
    expect(wrapper.get('img').attributes('alt')).toBe('');
  });
});
