// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import type { AppButtonProps } from '../AppButton.types';
import AppButton from '../AppButton.vue';

function render(props: AppButtonProps = {}, attrs: Record<string, unknown> = {}) {
  return mount(AppButton, { props, attrs, slots: { default: 'Label' } });
}

function classesOf(props: AppButtonProps) {
  return render(props).get('button').classes();
}

describe('AppButton', () => {
  it('renders the slot inside a native button', () => {
    const wrapper = render();

    expect(wrapper.get('button').text()).toBe('Label');
  });

  it('is primary and medium by default', () => {
    const classes = classesOf({});

    expect(classes).toContain('bg-(--bg-button-primary)');
    expect(classes).toContain('h-9');
  });

  // UI kit Button 55:1353: fill, stroke and label per type and state
  it.each([
    [
      'primary',
      [
        'bg-(--bg-button-primary)',
        'text-(--text-inverse-soft)',
        'hover:bg-(--bg-button-primary-hover)',
        'active:bg-(--bg-button-primary-hover)',
      ],
    ],
    [
      'secondary',
      [
        'bg-(--bg-button-secondary)',
        'text-(--default-foreground)',
        'hover:bg-(--bg-button-secondary-hover)',
        'active:bg-(--bg-button-secondary-hover)',
      ],
    ],
    [
      'outline',
      [
        'ring-(--border-default)',
        'bg-transparent',
        'text-(--default-foreground)',
        'hover:bg-(--bg-button-secondary)',
        'active:bg-(--bg-button-secondary)',
      ],
    ],
    [
      'ghost',
      ['bg-transparent', 'text-(--default-foreground)', 'hover:bg-(--bg-button-secondary)'],
    ],
  ] as const)('%s variant uses the UI kit tokens', (variant, expected) => {
    const classes = classesOf({ variant });

    expect(classes).toEqual(expect.arrayContaining([...expected]));
  });

  it('outline uses an inset ring, so the stroke does not change the size', () => {
    const classes = classesOf({ variant: 'outline' });

    expect(classes).toEqual(expect.arrayContaining(['ring-1', 'ring-inset']));
    expect(classes).not.toContain('border');
  });

  it('outline hover stroke turns to border/focus only for size=sm (55:1438 vs 55:1430)', () => {
    expect(classesOf({ variant: 'outline', size: 'small' })).toContain(
      'hover:ring-(--border-focus)',
    );
    expect(classesOf({ variant: 'outline', size: 'medium' })).not.toContain(
      'hover:ring-(--border-focus)',
    );
  });

  it('icon-only outline is transparent with the icon/primary color', () => {
    const classes = classesOf({ variant: 'outline', size: 'icon' });

    expect(classes).toEqual(
      expect.arrayContaining([
        'bg-transparent',
        'text-(--icon-primary)',
        'hover:bg-(--bg-button-secondary)',
      ]),
    );
  });

  it('ghost label is text/secondary for size=sm (55:1374)', () => {
    expect(classesOf({ variant: 'ghost', size: 'small' })).toContain('text-(--text-secondary)');
  });

  it('ghost icon-only uses icon/secondary, icon/primary on hover (55:1398 / 55:1458)', () => {
    expect(classesOf({ variant: 'ghost', size: 'icon' })).toEqual(
      expect.arrayContaining(['text-(--icon-secondary)', 'hover:text-(--icon-primary)']),
    );
  });

  // UI kit state=disabled is the default look at 50% opacity, state=focus adds the focus ring
  it.each(['primary', 'secondary', 'outline', 'ghost'] as const)(
    '%s: disabled is the default look at 50%% opacity, focus shows the ring',
    (variant) => {
      const classes = classesOf({ variant });

      expect(classes).toEqual(
        expect.arrayContaining(['disabled:opacity-50', 'focus-visible:shadow-(--shadow-focus)']),
      );
      expect(
        classes.filter(
          (c) =>
            c.startsWith('disabled:') &&
            c !== 'disabled:opacity-50' &&
            c !== 'disabled:pointer-events-none',
        ),
      ).toEqual([]);
    },
  );

  it.each([
    ['small', ['h-8', 'px-3']],
    ['medium', ['h-9', 'px-4']],
    ['icon', ['size-8', 'p-2']],
  ] as const)('%s size sets the box', (size, expected) => {
    expect(classesOf({ size })).toEqual(expect.arrayContaining([...expected]));
  });

  it('disabled button is disabled and does not emit clicks', async () => {
    const wrapper = render({ disabled: true });

    await wrapper.get('button').trigger('click');

    expect(wrapper.get('button').attributes('disabled')).toBeDefined();
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('passes attributes such as aria-label and type to the button', () => {
    const wrapper = render({ size: 'icon' }, { 'aria-label': 'Close', type: 'submit' });

    expect(wrapper.get('button').attributes('aria-label')).toBe('Close');
    expect(wrapper.get('button').attributes('type')).toBe('submit');
  });
});
