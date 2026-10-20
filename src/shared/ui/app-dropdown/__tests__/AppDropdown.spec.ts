// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';

import AppDropdown from '../AppDropdown.vue';
import AppDropdownItem from '../AppDropdownItem.vue';

/** Mounts a dropdown with a trigger and the given items, opens it from the keyboard */
async function open(
  props: { contentClass?: string } = {},
  items: () => ReturnType<typeof h>[] = () => [h(AppDropdownItem, () => 'Item')],
) {
  const Host = defineComponent(
    () => () =>
      h(AppDropdown, props, {
        trigger: () => h('button', { type: 'button' }, 'Open'),
        default: items,
      }),
  );
  const wrapper = mount(Host, { attachTo: document.body });
  await wrapper.get('button').trigger('keydown', { key: 'Enter' });
  await nextTick();
  return wrapper;
}

// Class list as an array: a substring check would match 'p-1' inside 'gap-1'
const classesOf = (el: Element) => [...el.classList];

// The menu is teleported to <body>
const menu = () => document.body.querySelector<HTMLElement>('[role="menu"]');

describe('AppDropdown', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('is closed until the trigger is used', () => {
    const Host = defineComponent(
      () => () => h(AppDropdown, null, { trigger: () => h('button', 'Open'), default: () => 'x' }),
    );
    mount(Host, { attachTo: document.body });

    expect(menu()).toBeNull();
  });

  it('opens from the keyboard and renders items as menuitems', async () => {
    await open();

    expect(menu()).not.toBeNull();
    expect(document.body.querySelectorAll('[role="menuitem"]')).toHaveLength(1);
  });

  // Consumers outside the header rely on these defaults (min width 160 was there before WT-323)
  it('has the default min width, padding and gap (Figma Dropdown/Default)', async () => {
    await open();

    expect(classesOf(menu()!)).toContain('min-w-40');
    expect(classesOf(menu()!)).toContain('gap-1');
    expect(classesOf(menu()!)).toContain('p-1');
  });

  it('contentClass replaces the default width, padding and gap', async () => {
    await open({ contentClass: 'w-60 pb-1' });

    expect(classesOf(menu()!)).toContain('w-60');
    expect(classesOf(menu()!)).not.toContain('min-w-40');
    expect(classesOf(menu()!)).not.toContain('p-1');
  });

  it('keeps the panel styles: radius xl, surface, panel shadow, no border', async () => {
    await open({ contentClass: 'w-60' });

    const classes = menu()!.className.split(' ');
    expect(classes).toEqual(
      expect.arrayContaining([
        'rounded-(--radius-xl)',
        'bg-(--bg-surface-primary)',
        'shadow-(--shadow-panel)',
      ]),
    );
    expect(classes).not.toContain('border');
  });
});

describe('AppDropdownItem', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('is a 32px menu item with the list hover color', async () => {
    await open();

    const item = document.body.querySelector('[role="menuitem"]')!;
    expect(classesOf(item)).toContain('h-8');
    expect(classesOf(item)).toContain('data-highlighted:bg-(--bg-surface-secondary)');
  });

  it('asChild makes the slot element itself the menu item, without the item styles', async () => {
    await open({}, () => [
      h(AppDropdownItem, { asChild: true }, () => h('button', { class: 'custom' }, 'Docs')),
    ]);

    const item = document.body.querySelector('[role="menuitem"]')!;
    expect(item.tagName).toBe('BUTTON');
    expect(item.textContent).toBe('Docs');
    expect(classesOf(item)).toContain('custom');
    expect(classesOf(item)).not.toContain('h-8');
  });
});
