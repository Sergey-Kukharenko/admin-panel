// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import AppFilter from '../AppFilter.vue';

const OPTIONS = [
  { value: '', label: 'Все типы данных' },
  { value: 'bets-id', label: 'bets' },
  { value: 'users-id', label: 'users' },
];

type Props = InstanceType<typeof AppFilter>['$props'];

function render(props: Partial<Props> = {}) {
  return mount(AppFilter, {
    props: { title: 'Тип данных', options: OPTIONS, ...props },
    attachTo: document.body,
  });
}

async function open(wrapper: ReturnType<typeof render>) {
  await wrapper.get('button').trigger('keydown', { key: 'Enter' });
  await nextTick();
}

// Class list as an array: a substring check would match 'p-1' inside 'gap-1'
const classesOf = (el: Element | null | undefined) => [...(el?.classList ?? [])];

// The menu is teleported to <body>
const menu = () => document.body.querySelector<HTMLElement>('[role="menu"]');

describe('AppFilter', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  // UI kit Filter 55:793: 32px, radius 8, inside 1px border/default, no fill, label 14/20 medium
  it('trigger follows the UI kit Filter', () => {
    const classes = render().get('button').classes();

    expect(classes).toEqual(
      expect.arrayContaining([
        'h-8',
        'rounded-(--radius-lg)',
        'ring-1',
        'ring-inset',
        'ring-(--border-default)',
        'pl-3',
        'pr-2',
        'gap-1.5',
        'text-element-button',
        'font-medium',
        'text-(--default-foreground)',
        'hover:bg-(--bg-button-secondary)',
        'data-[state=open]:bg-(--bg-button-secondary)',
        'focus-visible:shadow-(--shadow-focus)',
      ]),
    );
    expect(classes.some((name) => name.startsWith('bg-'))).toBe(false);
  });

  it('shows the leading icon only when it is given (dashboard filter hides it)', () => {
    const icons = (wrapper: ReturnType<typeof render>) =>
      wrapper.findAll('svg').map((svg) => svg.html());

    expect(icons(render()).some((html) => html.includes('file-list-3-line'))).toBe(false);
    expect(
      icons(render({ icon: 'file-list-3-line' })).some((html) => html.includes('file-list-3-line')),
    ).toBe(true);
  });

  it('single: shows the selected option and emits the picked value', async () => {
    const wrapper = render({ modelValue: 'bets-id', clearable: false });
    expect(wrapper.get('button').text()).toBe('bets');

    await open(wrapper);
    const items = [...(menu()?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? [])];
    expect(items.map((item) => item.textContent?.trim())).toEqual([
      'Все типы данных',
      'bets',
      'users',
    ]);

    items[2]?.click();
    await nextTick();
    expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual(['users-id']);
  });

  it('single: the reset cross replaces the arrow only when clearable', () => {
    const iconsOf = (props: Partial<Props>) =>
      render({ modelValue: 'bets-id', ...props })
        .findAll('svg')
        .map((svg) => svg.html());

    expect(iconsOf({}).some((html) => html.includes('small-close-line'))).toBe(true);
    const notClearable = iconsOf({ clearable: false });
    expect(notClearable.some((html) => html.includes('small-close-line'))).toBe(false);
    expect(notClearable.some((html) => html.includes('large-line-arrow-down'))).toBe(true);
  });

  it('single: the empty value shows the label of the empty option and no reset cross', () => {
    const wrapper = render({ modelValue: '' });

    expect(wrapper.get('button').text()).toBe('Все типы данных');
    expect(wrapper.html()).not.toContain('small-close-line');
  });

  it('menu items use the UI kit list item (32px, radius 8, highlight fill)', async () => {
    const wrapper = render();
    await open(wrapper);

    const item = menu()?.querySelector<HTMLElement>('[role="menuitemradio"]');
    expect(classesOf(item)).toContain('h-8');
    expect(classesOf(item)).toContain('rounded-(--radius-lg)');
    expect(classesOf(item)).toContain('data-highlighted:bg-(--bg-surface-secondary)');
    expect(classesOf(menu())).toContain('bg-(--bg-surface-primary)');
  });

  it('multiple: toggles values and shows the count', async () => {
    const wrapper = render({ multiple: true, modelValue: ['bets-id'] });
    expect(wrapper.get('button').text()).toContain('1');

    await open(wrapper);
    const items = [...(menu()?.querySelectorAll<HTMLElement>('[role="menuitemcheckbox"]') ?? [])];
    items[2]?.click();
    await nextTick();
    expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual([['bets-id', 'users-id']]);
  });

  it('disabled: the trigger is a disabled button with tertiary label and icons (UI kit state=disabled)', () => {
    const button = render({ disabled: true, icon: 'file-list-3-line' }).get('button');

    expect(button.attributes('disabled')).toBeDefined();
    expect(button.classes()).toContain('disabled:text-(--text-tertiary)');
    expect(button.find('svg').classes()).toContain('group-disabled:text-(--icon-tertiary)');
  });

  it('multiple: the count badge follows the UI kit (14px, bg/button/primary, text/on-dark)', () => {
    const badge = render({ multiple: true, modelValue: ['bets-id', 'users-id'] })
      .findAll('span')
      .find((span) => span.text() === '2');

    expect(badge?.classes()).toEqual(
      expect.arrayContaining([
        'size-3.5',
        'bg-(--bg-button-primary)',
        'text-(--text-on-dark)',
        'font-semibold',
      ]),
    );
  });
});
